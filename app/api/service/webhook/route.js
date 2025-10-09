// api/service/webhook/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient"; // ✅ make sure this exists

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_SERVICE; // create this in your .env

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // Handle only completed payments
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, service_name, price, type } = session.metadata;

      // Only process "service" type checkouts
      if (type === "service") {
        const { error } = await supabase.from("keycards_services").insert([
          {
            user_id: userId,
            service_name,
            price,
          },
        ]);

        if (error) {
          console.error("Supabase insert error:", error.message);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("✅ Service inserted successfully:", service_name);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
