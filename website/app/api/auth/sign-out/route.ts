import { NextResponse, type NextRequest } from "next/server";

import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { clearAuthCookies } from "@/lib/infrastructure/identity/AuthCookies";
import { createSignOutUseCase } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler-client";

export async function POST(request: NextRequest) {
  // The provisional response receives Supabase's SSR cookie mutations.
  const cookieResponse = new NextResponse();
  const supabase = createRouteHandlerClient(request, cookieResponse);
  const { error: supabaseError } = await supabase.auth.signOut();

  const token = request.cookies.get("pp_refresh_token")?.value;
  if (token) {
    try { bootstrapInfrastructure(); await createSignOutUseCase().execute(token); }
    catch { /* Legacy revocation is best-effort; its browser cookies are always removed. */ }
  }

  const response = NextResponse.json(
    supabaseError ? { error: "Unable to complete sign out." } : { success: true },
    { status: supabaseError ? 503 : 200 },
  );
  for (const cookie of cookieResponse.cookies.getAll()) response.cookies.set(cookie);
  clearAuthCookies(response);
  return response;
}
