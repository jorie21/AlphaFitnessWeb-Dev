import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    const { userId, type = "basic" } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch latest keycard for this user
    const { data: existingCards, error: fetchError } = await supabase
      .from("keycards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    // Restrict duplicate keycards
    if (existingCards && existingCards.length > 0) {
      const currentCard = existingCards[0];

      if (currentCard.status === "active") {
        return NextResponse.json(
          { error: "You already have an active keycard." },
          { status: 400 }
        );
      }

      if (currentCard.status === "expired" && type === "basic") {
        return NextResponse.json(
          { error: "You already have an expired keycard. Please renew instead of buying new." },
          { status: 400 }
        );
      }

      if (type === "renew" && currentCard.status !== "expired") {
        return NextResponse.json(
          { error: "You can only renew an expired keycard." },
          { status: 400 }
        );
      }
    }

    // Generate new unique key
    const uniqueId = `KEY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    // Generate QR code
    const qrData = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uniqueId}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // Insert pending keycard
    const { error: insertError } = await supabase.from("keycards").insert([
      {
        user_id: userId,
        unique_id: uniqueId,
        status: "pending",
        type,
        qr_code_url: qrCodeUrl,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json({
      message: "Keycard created. Pending admin confirmation.",
      uniqueId,
    });
  } catch (error) {
    console.error("❌ OTC Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
