// api/services/group-classes/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      className,
      price,
      paymentMethod = "online", // "online" | "counter"
    } = body;

    if (!userId || !className || price == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Accept numbers or formatted strings
    const parsedPrice =
      typeof price === "number"
        ? price
        : parseFloat(String(price).replace(/[^0-9.]/g, ""));

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Invalid or missing price (must be a positive number)" },
        { status: 400 }
      );
    }

    const referenceId = `GC-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    // === Pay On the Counter ===
    if (paymentMethod === "counter") {
      // end_date = now + 30 days (matches total_days default)
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const { error } = await supabase.from("group_classes").insert([
        {
          user_id: userId,
          reference_id: referenceId,
          class_name: className,
          price: parsedPrice,
          end_date: endDate.toISOString(),
          payment_method: "counter",
          status: "pending", // pending until paid at the counter
          // start_date defaults to now(), total_days defaults to 30
        },
      ]);

      if (error) {
        console.error("❌ Group Classes insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        status: "pending",
        reference_id: referenceId,
        message: "✅ Added as pending payment",
      });
    }

    // === Stripe Checkout (online) ===
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: className,
              description: "Alpha Fitness Group Class",
            },
            unit_amount: Math.round(parsedPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/serviceSuccess?reference_id=${referenceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      metadata: {
        type: "group_class",
        userId,
        class_name: className,
        price: parsedPrice.toString(),
        referenceId,
      },
    });

    return NextResponse.json({ url: session.url, referenceId });
  } catch (err) {
    console.error("Group Class Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
