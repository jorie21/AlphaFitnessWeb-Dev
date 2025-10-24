// /api/loyalty/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // read from the new stats table
    const { data, error } = await supabase
      .from("service_purchase_stats")
      .select("total_purchases")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    // if no row yet, treat as zero purchases
    const purchaseCount = data?.total_purchases ?? 0;

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
