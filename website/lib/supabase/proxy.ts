import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/config/env";

export function createProxyClient(request: NextRequest) {
  const refreshedCookies: Array<{ name: string; value: string; options: Parameters<NextResponse["cookies"]["set"]>[2] }> = [];
  const client = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => cookies.forEach(({ name, value, options }) => {
        request.cookies.set(name, value);
        refreshedCookies.push({ name, value, options });
      }),
    },
  });
  return { client, applyCookies(response: NextResponse) { refreshedCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); return response; } };
}
