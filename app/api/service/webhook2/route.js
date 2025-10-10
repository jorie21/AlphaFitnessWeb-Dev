// // api/service/webhook/route.js
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { supabase } from "@/lib/supabaseClient";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2024-06-20",
// });

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_SERVICE;

// export async function POST(req) {
//   const body = await req.text();
//   const sig = req.headers.get("stripe-signature");

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
//   } catch (err) {
//     console.error("⚠️ Webhook signature verification failed:", err.message);
//     return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
//   }

//   console.log("✅ Webhook event received:", event.type);

//   try {
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const { userId, service_name, price, type, uniqueId } = session.metadata;

//       console.log("📦 Session metadata:", { userId, service_name, price, type });

//       if (type === "service") {
//         const { data, error } = await supabase.from("keycards_services").insert([
//           {
//             user_id: userId,
//             keycard_id: null, // ✅ Explicitly set as null since it's nullable
//             service_name,
//             price: parseFloat(price), // ✅ Ensure it's a number
//           },
//         ]).select();

//         if (error) {
//           console.error("❌ Supabase insert error:", error);
//           return NextResponse.json({ error: error.message }, { status: 500 });
//         }

//         console.log("✅ Service inserted successfully:", data);
//       }
//     }

//     return NextResponse.json({ received: true });
//   } catch (err) {
//     console.error("❌ Webhook processing error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }