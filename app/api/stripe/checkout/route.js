import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { userId, type = "basic" } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Check for an existing keycard
    const { data: existingCards, error: fetchError } = await supabase
      .from("keycards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    let uniqueId;

    if (existingCards && existingCards.length > 0) {
      const currentCard = existingCards[0];

      if (type === "renew" && currentCard.status !== "expired") {
        return NextResponse.json(
          { error: "You can only renew an expired keycard." },
          { status: 400 }
        );
      }

      // use same unique ID for renew
      uniqueId = currentCard.unique_id;
    } else {
      // create new only if no existing keycard at all
      uniqueId = `KEY-${Math.random()
        .toString(36)
        .slice(2, 10)
        .toUpperCase()}`;

      const { error: insertError } = await supabase.from("keycards").insert([
        {
          user_id: userId,
          unique_id: uniqueId,
          status: "pending",
          type: "basic",
        },
      ]);

      if (insertError) throw insertError;
    }

    // create Stripe checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name:
                type === "renew"
                  ? "Alpha Fitness Keycard Renewal"
                  : "Alpha Fitness Basic Keycard",
            },
            unit_amount: type === "renew" ? 100 * 100 : 150 * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?uid=${uniqueId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/keycards`,
      metadata: { uniqueId, userId, type },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("🔥 Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
