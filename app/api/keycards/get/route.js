//api/keycards/get/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { keycardPurchaseSchema } from "@/app/actions/validation/keycardPurchaseSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, type } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const validationResult = await keycardPurchaseSchema.safeParseAsync({ userId, type });
    if (!validationResult.success) {
      const errorMessage = validationResult.error?.issues?.[0]?.message || "Invalid input data";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // ✅ Always fetch latest (we also reuse this for 'check')
    const { data: keycards, error: fetchError } = await supabase
      .from("keycards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Supabase error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch keycards" }, { status: 500 });
    }

    // ✅ NEW: existence-only path (no business rules)
    if (type === "check") {
      const hasKeycard = Array.isArray(keycards) && keycards.length > 0;
      return NextResponse.json({ hasKeycard, keycards: keycards ?? [] }, { status: 200 });
    }

    const latest = keycards?.[0];

    // 🔒 Existing business rules stay as-is
    if (type === "basic") {
      if (latest?.status === "active") {
        return NextResponse.json({ error: "You already have an active keycard." }, { status: 400 });
      }
      if (latest?.status === "pending") {
        return NextResponse.json({ error: "Your payment is still pending confirmation." }, { status: 400 });
      }
      if (latest?.status === "expired") {
        return NextResponse.json({ error: "You have an expired keycard. Please renew it instead." }, { status: 400 });
      }
    } else if (type === "renew") {
      if (!latest) {
        return NextResponse.json({ error: "You don't have a keycard to renew." }, { status: 400 });
      }
      if (latest.status !== "expired") {
        return NextResponse.json({ error: "You can only renew if your keycard is expired." }, { status: 400 });
      }
    } else if (type === "vip") {
      const { data: allKeycards, error: allFetchError } = await supabase
        .from("keycards")
        .select("is_vip")
        .eq("user_id", userId);

      if (allFetchError) {
        console.error("Supabase error fetching all keycards:", allFetchError);
        return NextResponse.json({ error: "Failed to validate VIP eligibility" }, { status: 500 });
      }

      const hasNonVip = allKeycards.some(k => !k.is_vip);
      if (!hasNonVip) {
        return NextResponse.json({ error: "You need an existing non-VIP keycard to avail VIP." }, { status: 400 });
      }
    }

    return NextResponse.json({ keycards, isValid: true });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
