import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { uniqueId } = await req.json();
    if (!uniqueId) {
      return NextResponse.json({ error: "Missing uniqueId" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("keycards")
      .select("unique_id,type,is_vip,status,expires_at,created_at,user_id")
      .eq("unique_id", uniqueId)
      .maybeSingle();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "Keycard not found" }, { status: 404 });

    return NextResponse.json({ keycard: data });
  } catch (err) {
    console.error("❌ Keycard receipt API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
