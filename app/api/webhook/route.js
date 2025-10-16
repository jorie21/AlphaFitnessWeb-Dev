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

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const qrData = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uniqueId}`;
  const qrCodeUrl = await QRCode.toDataURL(qrData);

  const { data, error } = await supabase
    .from("keycards")
    .insert([
      {
        user_id: userId,
        unique_id: uniqueId,
        status: "active",
        type: keycardType,
        expires_at: expiresAt.toISOString(),
        qr_code_url: qrCodeUrl,
      },
    ])
    .select();

  if (error) throw new Error(error.message);
  console.log("✅ Keycard created:", data);
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
      expires_at: newExpiry.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", expiredCard.id);

  if (updateErr) throw new Error(updateErr.message);
  console.log("✅ Keycard renewed successfully:", expiredCard.id);
}

/* ------------------------
   Membership handler
   ------------------------ */
async function handleMembershipCheckout(session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId || metadata.user_id;
  const priceRaw = metadata.price || metadata.amount;
  const referenceId = metadata.referenceId || metadata.reference_id || crypto.randomUUID();

  if (!userId || !priceRaw) {
    throw new Error("Missing userId or price in metadata");
  }

  const plan_title = "Membership";
  const price = parseFloat(String(priceRaw));

  // _________Find user's active keycard_________
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

  // __________Find existing active membership__________
  const { data: activeMembership, error: activeErr } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("end_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeErr) throw new Error(activeErr.message);

  // ____________Detect how many months to add based on plan price or name___________
  const monthsToAdd = (() => {
    const s = String(metadata.service_name || "").toLowerCase();
    if (s.includes("12")) return 12;
    if (s.includes("6")) return 6;
    if (s.includes("3")) return 3;
    return 1;
  })();

  // _________Helper to add months safely_________
  const addMonths = (date, months) => {
    const d = new Date(date.getTime());
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    if (d.getDate() < day) d.setDate(0);
    return d;
  };

  if (activeMembership) {
    // Extend membership
    const existingEnd = new Date(activeMembership.end_date);
    const newEnd = addMonths(existingEnd, monthsToAdd);
    const totalMonths = (activeMembership.total_months || 0) + monthsToAdd;
    const newPrice = (activeMembership.price || 0) + price;

    // 🧮 Recalculate days left
    const today = new Date();
    const daysLeft = Math.ceil((newEnd - today) / (1000 * 60 * 60 * 24));

    const { error: updateError } = await supabase
      .from("memberships")
      .update({
        end_date: newEnd.toISOString(),
        updated_at: new Date().toISOString(),
        total_months: totalMonths,
        plan_title,
        price: newPrice, // ✅ Added price accumulation
        days_left: daysLeft, // ✅ Keep your existing logic
      })
      .eq("id", activeMembership.id);

    if (updateError) throw new Error(updateError.message);

    console.log(
      `✅ Extended membership for user ${userId} to ${newEnd.toISOString()} (${totalMonths} months total, ₱${newPrice} total)`
    );
  } else {
    // Create new membership
    const startDate = new Date();
    const endDate = addMonths(startDate, monthsToAdd);
    const daysLeft = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const { error: insertError } = await supabase.from("memberships").insert([
      {
        user_id: userId,
        keycard_id: keycardId,
        reference_id: referenceId,
        plan_title,
        price,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "active",
        total_months: monthsToAdd,
        days_left: daysLeft, // ✅ Added
      },
    ]);

    if (insertError) throw new Error(insertError.message);

    console.log(
      `✅ New membership created for user ${userId} until ${endDate.toISOString()} (${monthsToAdd} months)`
    );
  }
}