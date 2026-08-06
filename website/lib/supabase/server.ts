import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/config/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // Server Components may read cookies but cannot persist refresh writes.
        // Proxy refreshes and persists sessions before rendering protected pages.
        setAll() {
          // Intentionally read-only in this runtime context.
        },
      },
    }
  );
}
