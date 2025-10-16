// /api/loyalty/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const { data, error } = await supabase
      .from("keycards_services")
      .select("id")
      .eq("user_id", userId);

    if (error) throw error;

    const purchaseCount = data.length;

    let status = "Bronze";
    if (purchaseCount >= 4 && purchaseCount < 10) status = "Silver";
    else if (purchaseCount >= 10) status = "Gold";

    return NextResponse.json({
      status,
      totalPurchases: purchaseCount,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
