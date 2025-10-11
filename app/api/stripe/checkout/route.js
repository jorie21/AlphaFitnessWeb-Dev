// api/service/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    // Parse the JSON body from the request
    const { userId, type = "basic" } = await req.json();

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Generate a unique transaction ID for reference
    const uniqueId = `KEY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    // Define price and product name based on type
    const isRenewal = type === "renew";
    const productName = isRenewal
      ? "Alpha Fitness Keycard Renewal"
      : "Alpha Fitness Basic Keycard";
    const amount = isRenewal ? 100 * 100 : 150 * 100; // Convert to centavos

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: productName,
              description: isRenewal
                ? "Renew your Alpha Fitness digital keycard for another year."
                : "Purchase a new Alpha Fitness digital keycard with QR access.",
            },
            unit_amount: amount,
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
        type: "keycard",   // identify this checkout as keycard-related
        keycardType: type, // “basic” or “renew” — used by webhook
      },
    });

    // Return the checkout URL to frontend
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("💥 Stripe checkout error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
