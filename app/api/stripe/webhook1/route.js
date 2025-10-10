// //api/stripe/webhook/route.js
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { supabase } from "@/lib/supabaseClient";
// import QRCode from "qrcode";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2024-06-20",
// });
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req) {
//   const sig = req.headers.get("stripe-signature");
//   const body = await req.text();

//   if (!sig) {
//     return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
//   }

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
//   } catch (err) {
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const { uniqueId, userId, type } = session.metadata || {};

//     if (!uniqueId || !userId) {
//       return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
//     }

//     const expiresAt = new Date();
//     expiresAt.setFullYear(expiresAt.getFullYear() + 1);

//     const qrData = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uniqueId}`;
//     const qrCodeUrl = await QRCode.toDataURL(qrData);

//     const { error: insertError } = await supabase.from("keycards").insert([
//       {
//         user_id: userId,
//         unique_id: uniqueId,
//         status: "active",
//         type: type || "basic",
//         expires_at: expiresAt,
//         qr_code_url: qrCodeUrl,
//       },
//     ]);

//     if (insertError) {
//       return NextResponse.json({ error: "Failed to create keycard" }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ received: true });
// }