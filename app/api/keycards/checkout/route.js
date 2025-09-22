import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    
    const { userId, type = "basic", services = [] } = await req.json();

    // create unique id for the keycard
    const uniqueId = `KEY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    // insert pending record to supabase
    await supabase.from("keycards").insert([{
      user_id: userId,
      unique_id: uniqueId,
      status: "pending",
      services
    }]);

    // create checkout session and attach uniqueId in metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "php",
          product_data: { name: type === "basic" ? "Basic Keycard" : "Renew Keycard" },
          unit_amount: 150 * 100, // ₱150
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?uid=${uniqueId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/keycards/cancel`,
      metadata: { uniqueId }, // used by webhook to find record
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
