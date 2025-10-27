// api/service/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId, type = "basic" } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const uniqueId = `APF-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    // Price + text based on type
    let productName, description, amount;
    if (type === "renew") {
      productName = "Alpha Fitness Keycard Renewal";
      description = "Extend your keycard access for another year.";
      amount = 100 * 100;
    } else if (type === "vip") {
      productName = "Alpha Fitness VIP Keycard (1-Year)";
      description = "Upgrade to VIP for 1-year premium access.";
      amount = 799 * 100;
    } else {
      productName = "Alpha Fitness Basic Keycard";
      description = "Basic keycard with no expiration.";
      amount = 150 * 100;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: { name: productName, description },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/keycardsuccess?uid=${uniqueId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      metadata: {
        uniqueId,
        userId,
        type: "keycard",
        keycardType: type, // "basic" | "renew" | "vip"
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("💥 Stripe checkout error:", err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}
