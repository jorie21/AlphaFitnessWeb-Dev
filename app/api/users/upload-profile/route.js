//api/users/upload-profile/route.js
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    // Read multipart form data
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file || !userId) {
      return Response.json({ error: "Missing file or userId" }, { status: 400 });
    }

    // Generate file path
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    // ✅ Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("avatars") // your bucket name
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // ✅ Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // ✅ Save to users table
    const { error: dbError } = await supabase
      .from("users")
      .update({ profile_picture: publicUrl, updated_at: new Date() })
      .eq("id", userId);

    if (dbError) throw dbError;

    return Response.json({ message: "Profile picture updated!", imageUrl: publicUrl }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
