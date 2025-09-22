import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const uniqueId = session.metadata?.uniqueId;
      const userId = session.metadata?.userId; // ✅ FIX: get userId properly

      if (!uniqueId || !userId) {
        console.warn("⚠️ Missing uniqueId or userId in session metadata");
      } else {
        // generate QR
        const qrDataUrl = await QRCode.toDataURL(uniqueId);

        // update supabase record
        const { data, error } = await supabase
          .from("keycards")
          .update({
            status: "active",
            qr_code_url: qrDataUrl,
            updated_at: new Date(),
          })
          .eq("unique_id", uniqueId)
          .eq("user_id", userId)
          .select();

        if (error) {
          console.error("❌ Error updating keycards:", error.message);
        } else {
          console.log("✅ Successfully updated keycards:", data);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
