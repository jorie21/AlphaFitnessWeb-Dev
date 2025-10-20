//api/services/group-classes/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const { userId, className, price } = await req.json();

    if (!userId || !className || !price) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const referenceId = `GC-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: className,
              description: "Alpha Fitness Group Class",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/serviceSuccess?reference_id=${referenceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      metadata: {
        type: "group_class",
        userId,
        class_name: className,
        price,
        referenceId,
      },
    });

    return NextResponse.json({ url: session.url, referenceId });
  } catch (err) {
    console.error("Group Class Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
