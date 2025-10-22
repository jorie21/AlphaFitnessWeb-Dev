// app/api/webhook/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";
import QRCode from "qrcode";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) {
    console.error("Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(
      "⚠️ Webhook signature verification failed:",
      err?.message || err
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Webhook event:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { type } = session.metadata || {};

      console.log("✅ Webhook event: checkout.session.completed");
      console.log("🔹 Metadata type:", type);

      try {
        if (type === "keycard") {
          const { keycardType } = session.metadata;
          if (keycardType === "renew") await handleRenewKeycard(session);
          else await handleKeycardCheckout(session);
        } else if (type === "membership") {
          console.log("🔥 Handling membership checkout...");
          await handleMembershipCheckout(session);
        } else if (type === "group_class") {
          console.log("🔥 Handling group class checkout...");
          await handleGroupClassCheckout(session);
        } else if (type === "personal_training") {
          console.log("🔥 Handling personal training checkout...");
          await handlePersonalTrainingCheckout(session);
        } else {
          console.warn("⚠️ Unknown or skipped checkout type:", type);
        }
      } catch (err) {
        console.error("❌ Error handling checkout.session.completed:", err);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook processing error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}

/* ------------------------
   Keycard Checkout
   ------------------------ */
async function handleKeycardCheckout(session) {
  const metadata = session.metadata || {};
  const uniqueId = metadata.uniqueId || metadata.unique_id;
  const userId = metadata.userId || metadata.user_id;
  const keycardType = metadata.keycardType || metadata.keycard_type || "basic";

  if (!uniqueId || !userId)
    throw new Error("Missing uniqueId or userId in metadata");

  if (keycardType === "vip") {
    // Upgrade existing non-VIP keycard to VIP
    const { data: existingCard, error: selectErr } = await supabase
      .from("keycards")
      .select("*")
      .eq("user_id", userId)
      .neq("type", "vip") // Find non-VIP keycard
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (selectErr) throw new Error(selectErr.message);
    if (!existingCard)
      throw new Error("No existing non-VIP keycard to upgrade");

    // Update the existing keycard to VIP
    const { error: updateErr } = await supabase
      .from("keycards")
      .update({
        type: "vip",
        is_vip: true,
        status: "active", // Ensure it's active
        expires_at: null, // VIP: no expiration
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingCard.id);

    if (updateErr) throw new Error(updateErr.message);
    console.log("✅ Keycard upgraded to VIP:", existingCard.id);
  } else {
    // For basic or other types: Insert new keycard
    const qrData = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uniqueId}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    const isVip = keycardType === "vip"; // This will be false here since we handled VIP above
    const expiresAt = isVip ? null : new Date(); // Basic: +1 year
    if (!isVip) expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { data, error } = await supabase
      .from("keycards")
      .insert([
        {
          user_id: userId,
          unique_id: uniqueId,
          status: "active",
          type: keycardType,
          is_vip: isVip,
          expires_at: expiresAt ? expiresAt.toISOString() : null,
          qr_code_url: qrCodeUrl,
        },
      ])
      .select();

    if (error) throw new Error(error.message);
    console.log("✅ Keycard created:", data);
  }
}

/* ------------------------
   Renew Keycard
   ------------------------ */
async function handleRenewKeycard(session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId || metadata.user_id;
  if (!userId) throw new Error("Missing userId in renewal metadata");

  const { data: expiredCard, error: selectErr } = await supabase
    .from("keycards")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "expired")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (selectErr) throw new Error(selectErr.message);

  if (!expiredCard) {
    console.warn("⚠️ No expired keycard found for renewal:", userId);
    return;
  }

  const newExpiry = new Date();
  newExpiry.setFullYear(newExpiry.getFullYear() + 1);

  const { error: updateErr } = await supabase
    .from("keycards")
    .update({
      status: "active",
      expires_at: newExpiry.toISOString(), // Renewal always sets +1 year (for basic)
      updated_at: new Date().toISOString(),
    })
    .eq("id", expiredCard.id);

  if (updateErr) throw new Error(updateErr.message);
  console.log("✅ Keycard renewed successfully:", expiredCard.id);
}

/* ------------------------
   Membership Checkout
   ------------------------ */
async function handleMembershipCheckout(session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId || metadata.user_id;
  const priceRaw = metadata.price || metadata.amount;
  const planTitle =
    metadata.plan_title ||
    metadata.plan ||
    metadata.service_name || // ✅ Add this line
    "Membership";
  const referenceId =
    metadata.referenceId || metadata.reference_id || crypto.randomUUID();

  if (!userId || !priceRaw) {
    throw new Error("Missing userId or price in metadata");
  }

  // _______Find user's active keycard_________
  const { data: keycardData, error: keycardError } = await supabase
    .from("keycards")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (keycardError) throw new Error(keycardError.message);
  const keycardId = keycardData?.id || null;
  if (!keycardId) throw new Error("No active keycard found for user");

  // _______Check duplicate reference_________
  const { data: existingRef, error: refErr } = await supabase
    .from("memberships")
    .select("id")
    .eq("reference_id", referenceId)
    .maybeSingle();

  if (refErr) throw new Error(refErr.message);
  if (existingRef) {
    console.log("⚠️ Duplicate membership webhook ignored:", referenceId);
    return;
  }

  // _______Check for active membership_______
  const now = new Date().toISOString();
  const { data: activeMemberships, error: activeError } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("end_date", now);

  if (activeError) throw new Error(activeError.message);
  if (activeMemberships && activeMemberships.length > 0) {
    throw new Error(
      "You already have an active membership. Please wait until it expires."
    );
  }

  // _______Determine months to add based on plan_______
  let monthsToAdd = 1;
  const match = planTitle.match(/(\d+)\s*month/i);
  if (match) monthsToAdd = parseInt(match[1]);

  // _______Compute dates_______
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + monthsToAdd);
  const daysLeft = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // _______Insert new membership_______
  const { error: insertError } = await supabase.from("memberships").insert([
    {
      user_id: userId,
      keycard_id: keycardId,
      reference_id: referenceId,
      plan_title: planTitle,
      price: parseFloat(String(priceRaw)),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: "active",
      total_months: monthsToAdd,
      days_left: daysLeft,
    },
  ]);

  if (insertError) throw new Error(insertError.message);

  console.log(
    `✅ New ${planTitle} membership created for user ${userId} valid until ${endDate.toISOString()} (${monthsToAdd} months)`
  );
}

/* ------------------------
   Group Class Checkout
   ------------------------ */
async function handleGroupClassCheckout(session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId || metadata.user_id;
  const className =
    metadata.class_name || metadata.service_name || "Group Class";
  const priceRaw = metadata.price || metadata.amount;
  const referenceId =
    metadata.referenceId || metadata.reference_id || crypto.randomUUID();

  if (!userId || !className || !priceRaw) {
    throw new Error("Missing userId, className, or price in metadata");
  }

  // 🔍 Check duplicate reference
  const { data: existing, error: existingErr } = await supabase
    .from("group_classes")
    .select("id")
    .eq("reference_id", referenceId)
    .maybeSingle();

  if (existingErr) throw new Error(existingErr.message);
  if (existing) {
    console.log("⚠️ Duplicate group class webhook ignored:", referenceId);
    return;
  }

  // 🕓 Duration (30 days)
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  // 🎫 Link active keycard (if exists)
  const { data: keycard, error: keycardErr } = await supabase
    .from("keycards")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (keycardErr) throw new Error(keycardErr.message);

  if (!keycard) {
    throw new Error(
      "No active keycard found for user. Cannot enroll in group classes."
    );
  }

  // 💾 Insert new record
  const { error: insertErr } = await supabase.from("group_classes").insert([
    {
      user_id: userId,
      keycard_id: keycard?.id || null,
      reference_id: referenceId,
      class_name: className,
      price: parseFloat(String(priceRaw)),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_days: 30,
      status: "active",
    },
  ]);

  if (insertErr) throw new Error(insertErr.message);
  console.log(`✅ Group class "${className}" added for user ${userId}`);
}
/* ------------------------
   Personal Training Checkout
   ------------------------ */
async function handlePersonalTrainingCheckout(session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId || metadata.user_id;
  const trainingType = metadata.trainingType || metadata.training_type;
  const title = metadata.title;
  const priceRaw = metadata.price;
  const referenceId = metadata.referenceId || metadata.reference_id;

  // Validate essential metadata
  if (!userId || !trainingType || !priceRaw || !title || !referenceId) {
    throw new Error("Missing personal training metadata");
  }

  // Parse price
  const price = parseFloat(priceRaw);
  if (isNaN(price) || price <= 0) {
    throw new Error("Invalid price in metadata");
  }

  // Insert into Supabase
  const { error } = await supabase.from("personal_training").insert([
    {
      user_id: userId,
      training_type: trainingType,
      title,
      price,
      payment_method: "online",
      status: "paid", // ✅ for Stripe payments only
      reference_id: referenceId,
    },
  ]);

  if (error) {
    console.error("❌ Database insert error:", error);
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(`✅ Personal training "${title}" recorded for user ${userId} (reference_id: ${referenceId})`);
}
