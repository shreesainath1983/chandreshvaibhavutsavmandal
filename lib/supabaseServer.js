import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the service role key for insert/update operations.
// Make sure these env vars are set in your environment or .env:
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
export const supabaseServer = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default supabaseServer;
