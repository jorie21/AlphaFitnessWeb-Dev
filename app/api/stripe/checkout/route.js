// api/stripe/checkout/route.js 
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId, keycardType = "basic" } = await req.json(); // Renamed to avoid confusion

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const uniqueId = `KEY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name:
                keycardType === "renew"
                  ? "Alpha Fitness Keycard Renewal"
                  : "Alpha Fitness Basic Keycard",
            },
            unit_amount: keycardType === "renew" ? 100 * 100 : 150 * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?uid=${uniqueId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      metadata: {
        uniqueId,
        userId,
        type: "keycard", // ✅ FIXED: This tells webhook it's a keycard purchase
        keycardType, // ✅ Keep this for tracking basic vs renew
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}