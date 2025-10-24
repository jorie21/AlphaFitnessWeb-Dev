import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

/**
 * POST { image_url, alt?, is_active? }
 * Use only from a trusted server action/admin tool.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body?.image_url) {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        image_url: body.image_url,
        alt: body.alt || null,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ announcement: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
