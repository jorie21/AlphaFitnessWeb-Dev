// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_ROLE_KEY // server-side (safe)
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // client-side

export const supabase = createClient(supabaseUrl, supabaseKey);
