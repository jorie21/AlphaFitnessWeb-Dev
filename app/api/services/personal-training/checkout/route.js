import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  console.log("🔄 Checkout request received"); // Add this for debugging
  try {
    const body = await req.json();
    console.log("Request body:", body); // Log incoming data

    const { userId, trainingType, title, price, paymentMethod = "online" } = body;

    // Validate required fields
    if (!userId || !trainingType || !title) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Parse and validate price
    const cleanedPrice = price ? price.replace(/[^0-9.]/g, "") : "";
    const parsedPrice = parseFloat(cleanedPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      console.log("❌ Invalid price:", price, "->", parsedPrice);
      return NextResponse.json({ error: "Invalid or missing price (must be a positive number)" }, { status: 400 });
    }

    const referenceId = crypto.randomUUID();
    console.log("Generated referenceId:", referenceId);

    // Pay on Counter logic
    if (paymentMethod === "counter") {
      console.log("Processing counter payment");
      const { error } = await supabase.from("personal_training").insert([
        {
          user_id: userId,
          training_type: trainingType,
          title,
          price: parsedPrice,
          payment_method: "counter",
          status: "pending",
          reference_id: referenceId,
        },
      ]);

      if (error) {
        console.error("❌ Counter insert error:", error);
        return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
      }

      console.log("✅ Counter payment recorded");
      return NextResponse.json({
        success: true,
        message: "Pay on counter recorded",
        reference_id: referenceId,
        status: "pending",
      });
    }

    // Stripe Checkout
    console.log("Creating Stripe session");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: { name: `${title} - ${trainingType}` },
            unit_amount: Math.round(parsedPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/serviceSuccess?reference_id=${referenceId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        type: "personal_training",
        userId,
        trainingType,
        title,
        price: parsedPrice.toString(),
        referenceId,
      },
    });

    console.log("✅ Stripe session created:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Checkout error:", error); // Log full error object
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}