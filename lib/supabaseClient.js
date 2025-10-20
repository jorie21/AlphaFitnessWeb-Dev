//lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Determine environment: server (API, Next.js route) or client (browser)
const isServer = typeof window === "undefined";

// Choose key based on environment
const supabaseKey = isServer
  ? process.env.SUPABASE_SERVICE_ROLE_KEY // ✅ full access for backend (RLS bypass)
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // ✅ safe key for client

// Create client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey
);
