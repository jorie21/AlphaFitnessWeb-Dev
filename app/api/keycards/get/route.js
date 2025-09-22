import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid)
    return NextResponse.json({ error: "uid required" }, { status: 400 });

  const { data, error } = await supabase
    .from("keycards")
    .select("*")
    .eq("unique_id", uid)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ keycard: data });
}
