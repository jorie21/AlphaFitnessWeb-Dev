// api/service/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId, plan } = await req.json();

    if (!userId || !plan?.title || !plan?.Price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique service ID (optional)
    const uniqueId = `SRV-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: plan.title,
              description: "Alpha Fitness Membership Service",
            },
            unit_amount: Number(plan.Price.replace(/[^\d]/g, "")) * 100, // convert "₱150" → 15000
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
        service_name: plan.title,
        price: Number(plan.Price.replace(/[^\d]/g, "")),
        type: "service",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
