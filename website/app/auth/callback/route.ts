import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const next = request.nextUrl.searchParams.get("next");
  const invalidRecoveryUrl = new URL("/reset-password?error=invalid_recovery_link", request.url);

  // This endpoint is intentionally a recovery-only callback. It must not become
  // an open redirect or accept a token intended for another Supabase flow.
  if (!tokenHash || type !== "recovery" || next !== "/reset-password") {
    return NextResponse.redirect(invalidRecoveryUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: "recovery",
  });

  // Do not expose or log the token hash. A failed verification is deliberately
  // indistinguishable to the browser from an expired or previously used link.
  if (error) return NextResponse.redirect(invalidRecoveryUrl);

  return NextResponse.redirect(new URL("/reset-password", request.url));
}
