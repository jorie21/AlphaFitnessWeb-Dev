import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY client. Never import this in a client component.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // <-- service role (bypasses RLS)
  { auth: { persistSession: false }, db: { schema: "public" } }
);
