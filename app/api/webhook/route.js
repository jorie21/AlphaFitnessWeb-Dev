//webhook route
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

if (event.type === "checkout.session.completed") {
  const session = event.data.object;

  // Use the correct metadata keys
  const { user_id, type } = session.metadata;

  const { error } = await supabase.from("keycards").insert([
    {
      user_id: user_id,
      type: type,
      stripe_session_id: session.id,
      status: "active",
      purchased_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error);
  }
}
  return NextResponse.json({ received: true });
}
