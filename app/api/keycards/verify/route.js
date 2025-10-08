import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { uniqueId } = await req.json();

    if (!uniqueId) {
      return NextResponse.json({ error: "Missing uniqueId" }, { status: 400 });
    }

    // 1️⃣ Fetch the keycard and user
    const { data: keycard, error: keycardError } = await supabase
      .from("keycards")
      .select("id, user_id, status, type, expires_at, qr_code_url, user:auth.users(username, email)")
      .eq("unique_id", uniqueId)
      .single();

    if (keycardError || !keycard) {
      return NextResponse.json({ error: "Keycard not found" }, { status: 404 });
    }

    // 2️⃣ Fetch the services availed
    const { data: services } = await supabase
      .from("keycards_services")
      .select("service_name, price, created_at")
      .eq("user_id", keycard.user_id);

    return NextResponse.json({
      user: keycard.user,
      services,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
