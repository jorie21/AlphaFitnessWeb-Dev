//api/keycards/get/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    const { data: keycards, error } = await supabase
      .from("keycards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch keycards" }, { status: 500 });
    }

    return NextResponse.json({ keycards });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
