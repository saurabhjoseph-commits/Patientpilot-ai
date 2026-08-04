/**
 * PatientPilot AI
 * Infrastructure Layer
 * Supabase Client
 *
 * Centralized Supabase client factory.
 */

import {
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) {
    return client;
  }

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured.",
    );
  }

  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.",
    );
  }

  client = createClient(url, key);

  return client;
}

export default getSupabaseClient;