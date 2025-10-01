// app/api/keycards/insert/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid"; // to generate unique_id

export async function POST(req) {
  try {
    const { user_id, type, status } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing required field: user_id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("keycards").insert([
      {
        user_id,
        unique_id: uuidv4(), // generate a unique keycard ID
        type: type || "basic",
        status: status || "active",
        expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // optional 1 month expiry
        qr_code_url: null, // optional placeholder
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Debug keycard inserted:", data);
    return NextResponse.json({ message: "Keycard inserted", data });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
