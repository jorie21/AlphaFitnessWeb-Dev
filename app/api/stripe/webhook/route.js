import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { uniqueId, userId } = session.metadata;

    console.log("✅ Payment success for:", uniqueId);

    // set expiry (1 year)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // generate QR
    const qrData = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uniqueId}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // update existing keycard
    const { error: updateError } = await supabase
      .from("keycards")
      .update({
        status: "active",
        expires_at: expiresAt,
        qr_code_url: qrCodeUrl,
      })
      .eq("unique_id", uniqueId);

    if (updateError) {
      console.error("❌ Failed to update keycard:", updateError);
      return NextResponse.json(
        { error: "Failed to update keycard" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
