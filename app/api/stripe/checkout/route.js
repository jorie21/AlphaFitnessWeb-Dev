import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { type, userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing userId or email" },
        { status: 400 }
      );
    }

    // Define prices for each keycard type
    const prices = {
      basic: 15000, // ₱150 in cents (Stripe uses smallest currency unit)
      renew: 10000, // ₱100 in cents (adjust price as needed)
    };

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: type === "basic" 
                ? "Alpha Fitness Basic Keycard" 
                : "Alpha Fitness Keycard Renewal",
              description: type === "basic"
                ? "Digital keycard with QR code access"
                : "Renew your existing keycard",
              images: ["https://your-logo-url.com/logo.png"], // Optional: add your logo
            },
            unit_amount: prices[type],
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/keycards`,
      customer_email: email,
      metadata: {
        userId,
        type,
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}