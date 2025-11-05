//api/services/membership/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId, plan, paymentMethod = "online" } = await req.json();

    if (!userId || !plan?.title || !plan?.Price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const price = Number(plan.Price.replace(/[^\d]/g, ""));
    const plan_title = "Membership";
    const referenceId = `APF-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;  // Improved random ID

    if (paymentMethod === "otc") {
      // _______Check for active membership_______
      const now = new Date().toISOString();
      const { data: activeMemberships, error: activeError } = await supabase
        .from("memberships")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .gt("end_date", now);  // Ensure end_date is in the future

      if (activeError) throw new Error(activeError.message);
      if (activeMemberships && activeMemberships.length > 0) {
        return NextResponse.json(
          { error: "You already have an active membership. Please wait until it expires." },
          { status: 400 }
        );
      }

      const monthsToAdd = plan.title.includes("12")
        ? 12
        : plan.title.includes("6")
        ? 6
        : plan.title.includes("3")
        ? 3
        : 1;
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
      const daysLeft = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Find active keycard
      const { data: keycardData, error: keycardError } = await supabase
        .from("keycards")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (keycardError) throw new Error(keycardError.message);
      const keycardId = keycardData?.id || null;
      if (!keycardId) throw new Error("No active keycard found for user");

      // Insert pending membership
      const { error: insertError } = await supabase.from("memberships").insert([
        {
          user_id: userId,
          keycard_id: keycardId,
          reference_id: referenceId,
          plan_title,
          price,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: "pending",
          total_months: monthsToAdd,
          days_left: daysLeft,
        },
      ]);

      if (insertError) throw new Error(insertError.message);

      return NextResponse.json({
        message: "OTC membership created (pending)",
        referenceId,
      });
    }

    // Online Logic (Stripe) remains unchanged
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: plan.title,
              description: "Alpha Fitness Membership Service",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/serviceSuccess?reference_id=${referenceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      metadata: {
        referenceId,
        userId,
        service_name: plan.title,
        price,
        type: "membership",
        paymentMethod: "online",
      },
    });

    return NextResponse.json({ url: session.url, referenceId });
  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
