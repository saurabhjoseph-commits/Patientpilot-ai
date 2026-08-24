import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { clearAuthCookies } from "@/lib/infrastructure/identity/AuthCookies";
import { getSignInConfiguration } from "@/lib/auth/sign-in-configuration";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler-client";

type SignInFailureCode =
  | "CONFIGURATION_ERROR"
  | "SUPABASE_AUTH_ERROR"
  | "INVALID_CREDENTIALS"
  | "PROFILE_NOT_FOUND"
  | "CLINIC_NOT_FOUND"
  | "COOKIE_ERROR"
  | "UNEXPECTED_ERROR";

const allowedRoles = new Set([
  "super_admin",
  "owner",
  "manager",
  "receptionist",
  "dentist",
  "doctor",
]);

function failure(code: SignInFailureCode, status: number, error: string) {
  // The code is intentionally safe for server-side staging diagnostics. Never
  // include provider errors, secrets, request bodies, or stack traces here.
  console.warn("auth.sign_in.failure", { code });
  return NextResponse.json({ code, error }, { status });
}

function isCookieMutationError(error: unknown): boolean {
  return error instanceof Error && /cookie.*(modify|write)|cookies can only be modified/i.test(error.message);
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);

  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as { email?: unknown }).email !== "string" ||
    typeof (body as { password?: unknown }).password !== "string"
  ) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const email = (body as { email: string }).email.trim().toLowerCase();
  const password = (body as { password: string }).password;
  const configuration = getSignInConfiguration();
  if (!configuration.ok) {
    return failure("CONFIGURATION_ERROR", 503, "Sign-in is temporarily unavailable.");
  }

  const supabaseResponse = NextResponse.json({ success: true });
  let userId: string;

  try {
    const supabase = createRouteHandlerClient(request, supabaseResponse);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return failure("INVALID_CREDENTIALS", 401, "Invalid email or password.");
    }

    userId = data.user.id;
  } catch (error) {
    return isCookieMutationError(error)
      ? failure("COOKIE_ERROR", 500, "Sign-in could not establish a session.")
      : failure("SUPABASE_AUTH_ERROR", 503, "Sign-in is temporarily unavailable.");
  }

  try {
    const serviceClient = createClient(
      configuration.value.supabaseUrl,
      configuration.value.supabaseServiceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .select("clinic_id,role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      return failure("UNEXPECTED_ERROR", 503, "Sign-in is temporarily unavailable.");
    }
    if (!profile?.clinic_id || !profile.role || !allowedRoles.has(profile.role)) {
      return failure("PROFILE_NOT_FOUND", 403, "This account is not ready for dashboard access. Contact an administrator.");
    }

    const { data: clinic, error: clinicError } = await serviceClient
      .from("clinics")
      .select("id")
      .eq("id", profile.clinic_id)
      .maybeSingle();

    if (clinicError) {
      return failure("UNEXPECTED_ERROR", 503, "Sign-in is temporarily unavailable.");
    }
    if (!clinic) {
      return failure("CLINIC_NOT_FOUND", 403, "This account is not ready for dashboard access. Contact an administrator.");
    }

    // Supabase's SSR client has already placed its session cookies on this
    // response. Remove only legacy compatibility cookies.
    clearAuthCookies(supabaseResponse);
    return supabaseResponse;
  } catch {
    return failure("UNEXPECTED_ERROR", 500, "Unable to sign in.");
  }
}
