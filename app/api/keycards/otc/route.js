// app/api/keycards/otc/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { userId, type = "basic" } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Load user's keycards (latest first)
    const { data: cards, error: listErr } = await supabase
      .from("keycards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (listErr) throw listErr;

    const latest = cards?.[0] || null;
    const hasAny = (cards?.length || 0) > 0;
    const hasVip = cards?.some(
      (c) => c.is_vip === true || String(c.type).toLowerCase() === "vip"
    );
    const nonVipCard = cards?.find((c) => !c.is_vip) || null;

    const referenceId = `APF-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // ---------- BASIC (OTC) ----------
    if (type === "basic") {
      // Only allowed if user has NO keycard
      if (hasAny) {
        return NextResponse.json(
          { error: "You already have a keycard." },
          { status: 400 }
        );
      }

      const uniqueId = `KEY-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
      const qrData = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uniqueId}`;
      const qrCodeUrl = await QRCode.toDataURL(qrData);

      const { error: insErr } = await supabase.from("keycards").insert([
        {
          user_id: userId,
          unique_id: uniqueId,
          status: "pending", // pending until paid
          type: "basic",
          is_vip: false,
          expires_at: null, // Basic = no expiration
          qr_code_url: qrCodeUrl,
        },
      ]);
      if (insErr) throw insErr;

      return NextResponse.json({
        message: "Basic keycard created. Pending admin confirmation.",
        referenceId,
        uniqueId,
        url: `/payment/otcServices?reference_id=${referenceId}&service=keycard&id=${uniqueId}`,
      });
    }

    // ---------- VIP (OTC) ----------
    if (type === "vip") {
      // Must already have a Basic/non-VIP card; cannot already be VIP
      if (hasVip) {
        return NextResponse.json(
          { error: "You already have a VIP keycard." },
          { status: 400 }
        );
      }
      if (!nonVipCard) {
        return NextResponse.json(
          { error: "VIP upgrade requires an existing Basic keycard." },
          { status: 400 }
        );
      }
      if (latest && String(latest.status).toLowerCase() === "pending") {
        return NextResponse.json(
          { error: "You already have a pending keycard action." },
          { status: 400 }
        );
      }

      // Convert existing Basic -> VIP (PENDING + 1-year expiration)
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);

      const { error: updErr } = await supabase
        .from("keycards")
        .update({
          type: "vip",
          is_vip: true,
          status: "pending", // stays pending until cashier approves
          expires_at: expires.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", nonVipCard.id);

      if (updErr) throw updErr;

      const uniqueId = nonVipCard.unique_id; // ✅ define uniqueId here

      return NextResponse.json({
        message: "VIP upgrade pending for OTC payment.",
        referenceId,
        uniqueId,
        url: `/payment/otcSuccess?reference_id=${referenceId}&service=keycard&id=${uniqueId}`,
      });
    }

    return NextResponse.json({ error: "Unsupported OTC type." }, { status: 400 });
  } catch (error) {
    console.error("❌ OTC Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 }
    );
  }
}
