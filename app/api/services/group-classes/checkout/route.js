// api/services/group-classes/checkout/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, className, price, paymentMethod = "online" } = body;

    if (!userId || !className || price == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const parsedPrice =
      typeof price === "number" ? price : parseFloat(String(price).replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const referenceId = `GC-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // === Pay On the Counter ===
    if (paymentMethod === "counter" || paymentMethod === "otc" || paymentMethod === "counter".toLowerCase()) {
      // Find ACTIVE keycard
      const { data: keycard, error: kcErr } = await supabase
        .from("keycards")
        .select("id, status")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (kcErr) {
        console.error("keycard lookup error:", kcErr);
        return NextResponse.json({ error: kcErr.message }, { status: 500 });
      }
      if (!keycard) {
        return NextResponse.json(
          { error: "No ACTIVE keycard found. Please activate your keycard first." },
          { status: 400 }
        );
      }

      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const { error } = await supabase.from("group_classes").insert([{
        user_id: userId,
        keycard_id: keycard.id,            // ✅ link it here
        reference_id: referenceId,
        class_name: className,
        price: parsedPrice,
        start_date: new Date().toISOString(),
        end_date: endDate.toISOString(),
        total_days: 30,
        payment_method: "counter",
        status: "pending",                 // pending until paid
      }]);

      if (error) {
        console.error("❌ Group Classes insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        status: "pending",
        reference_id: referenceId,
        message: "✅ Added as pending payment",
      });
    }

    // === Stripe Checkout (online) === (unchanged)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "php",
          product_data: { name: className, description: "Alpha Fitness Group Class" },
          unit_amount: Math.round(parsedPrice * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/serviceSuccess?reference_id=${referenceId}&service=group_class`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      metadata: {
        type: "group_class",
        userId,
        class_name: className,
        price: parsedPrice.toString(),
        referenceId,
      },
    });

    return NextResponse.json({ url: session.url, referenceId });
  } catch (err) {
    console.error("Group Class Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

