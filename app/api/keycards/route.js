import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import Xendit from "xendit-node";
import QRCode from "qrcode";

// ✅ Correct way: pass your Xendit secret key
const x = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
const { EWallet } = x;
const ewallet = new EWallet({});

export async function POST(req) {
  try {
    const { userId, type, keycardId, services, eWalletType } = await req.json();

    // Create Xendit payment
    const payment = await ewallet.createPayment({
      externalID: `keycard-${Date.now()}`,
      amount: 150, // flat fee for both cases
      eWalletType: eWalletType || "GCASH", // or "PAYMAYA"
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/keycards/callback`,
    });

    if (type === "basic") {
      const newKeycardId = `KEY-${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`;
      const qrCodeUrl = await QRCode.toDataURL(newKeycardId);

      await supabase.from("keycards").insert([
        {
          user_id: userId,
          keycard_id: newKeycardId,
          qr_code_url: qrCodeUrl,
        },
      ]);
    }

    if (type === "renew" && keycardId) {
      if (services && services.length > 0) {
        for (const service of services) {
          await supabase.from("keycard_services").insert([
            {
              keycard_id: keycardId,
              service_type: service,
              valid_until: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
              ),
            },
          ]);
        }
      }
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
