import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch keycards for the user
    const { data, error } = await supabase
      .from("keycards")
      .select("*")
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch keycards" }, { status: 500 });
    }

    return NextResponse.json({ keycards: data });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
