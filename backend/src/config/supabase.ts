import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Service-role Supabase client.
 *
 * IMPORTANT: this client bypasses Row Level Security. It must NEVER be
 * exposed to the frontend and must never be imported outside the backend.
 * All authorization (who can see/do what) has to be enforced explicitly
 * in our route/controller code — see src/middleware/auth.ts (added in a
 * later step) for role checks.
 */
export const supabaseAdmin = createClient(
  env.supabaseUrl,
  env.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
