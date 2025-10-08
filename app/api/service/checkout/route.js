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

    const priceNumber = parseInt(plan.Price.replace(/[^0-9]/g, ""));
    if (isNaN(priceNumber)) {
      return NextResponse.json({ error: "Invalid price format" }, { status: 400 });
    }

    // Log for debugging
    console.log("Creating Stripe session for:", { userId, planTitle: plan.title, price: priceNumber });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: { name: plan.title },
            unit_amount: priceNumber * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?service=${plan.title}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      metadata: { userId, planTitle: plan.title, price: plan.Price },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Service Checkout Error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
