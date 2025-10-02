import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, type } = session.metadata;

    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();
      const uniqueId = `KC-${timestamp}-${randomString}`;
      
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${uniqueId}`;

      const { data: keycard, error } = await supabase
        .from("keycards")
        .insert({
          user_id: userId,
          unique_id: uniqueId,
          type: type,
          status: "active",
          expires_at: expiresAt.toISOString(),
          qr_code_url: qrCodeUrl,
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to create keycard" },
          { status: 500 }
        );
      }

      console.log("Keycard created successfully:", keycard);

    } catch (error) {
      console.error("Error processing payment:", error);
      return NextResponse.json(
        { error: "Failed to process payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}