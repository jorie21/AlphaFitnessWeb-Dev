//get route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { userId } = await req.json();
    console.log("API received userId:", userId);

    const { data: keycards, error } = await supabase
      .from("keycards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    console.log("Supabase returned:", keycards, "Error:", error);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch keycards" }, { status: 500 });
    }

    return NextResponse.json({ keycards });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

