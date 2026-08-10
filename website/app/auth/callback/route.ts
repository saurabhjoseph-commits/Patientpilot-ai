import { NextResponse, type NextRequest } from "next/server";

import { createRouteHandlerClient } from "@/lib/supabase/route-handler-client";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const next = request.nextUrl.searchParams.get("next");
  const invalidRecoveryUrl = new URL("/login?error=invalid_activation_link", request.url);

  const recovery = type === "recovery" && next === "/reset-password";
  const invitation = type === "invite" && next === "/set-password";
  if (!tokenHash || (!recovery && !invitation)) {
    return NextResponse.redirect(invalidRecoveryUrl);
  }

  const response = NextResponse.redirect(new URL(next!, request.url));
  const supabase = createRouteHandlerClient(request, response);
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: invitation ? "invite" : "recovery",
  });

  // Do not expose or log the token hash. A failed verification is deliberately
  // indistinguishable to the browser from an expired or previously used link.
  if (error) return NextResponse.redirect(invalidRecoveryUrl);

  return response;
}
