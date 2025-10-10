import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    console.error("❌ Missing stripe-signature");
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Webhook event received:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { type } = session.metadata || {};

      console.log("📦 Session metadata:", session.metadata);

      // Route to appropriate handler based on 'type'
      if (type === "keycard") {
        await handleKeycardCheckout(session);
      } else if (type === "service") {
        await handleServiceCheckout(session);
      } else {
        console.warn("⚠️ Unknown checkout type:", type);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Handle keycard purchases
async function handleKeycardCheckout(session) {
  const { uniqueId, userId, keycardType } = session.metadata;

  if (!uniqueId || !userId) {
    throw new Error("Missing uniqueId or userId in metadata");
  }

  console.log("🎫 Processing keycard checkout...");

  // Set expiration date (1 year from now)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Generate QR code
  const qrData = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uniqueId}`;
  const qrCodeUrl = await QRCode.toDataURL(qrData);

  // Insert keycard into database (matching your exact schema)
  const { data, error } = await supabase.from("keycards").insert([
    {
      user_id: userId,
      unique_id: uniqueId,
      status: "active", // matches keycard_status enum
      type: keycardType || "basic", // matches your column name
      expires_at: expiresAt.toISOString(),
      qr_code_url: qrCodeUrl,
    },
  ]).select();

  if (error) {
    console.error("❌ Keycard insert error:", error);
    throw new Error(error.message);
  }

  console.log("✅ Keycard created successfully:", data);
}

// Handle service purchases (gym memberships)
async function handleServiceCheckout(session) {
  const { userId, service_name, price } = session.metadata;

  if (!userId || !service_name || !price) {
    throw new Error("Missing userId, service_name, or price in metadata");
  }

  console.log("🏋️ Processing service checkout...");

  // Find user's active keycard to link the service to
  const { data: keycardData, error: keycardError } = await supabase
    .from("keycards")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (keycardError && keycardError.code !== "PGRST116") {
    // PGRST116 = no rows returned (user has no keycard yet)
    console.error("❌ Error fetching keycard:", keycardError);
    throw new Error(keycardError.message);
  }

  const keycardId = keycardData?.id || null;

  if (!keycardId) {
    console.warn("⚠️ User has no active keycard. Service will be created without keycard link.");
  } else {
    console.log("✅ Found keycard to link:", keycardId);
  }

  // Insert service into database (matching your exact schema)
  const { data, error } = await supabase.from("keycards_services").insert([
    {
      user_id: userId,
      keycard_id: keycardId, // ✅ Link to user's active keycard
      service_name,
      price: parseFloat(price), // numeric(10, 2)
    },
  ]).select();

  if (error) {
    console.error("❌ Service insert error:", error);
    throw new Error(error.message);
  }

  console.log("✅ Service inserted successfully:", data);
}