import { NextResponse, type NextRequest } from "next/server";

import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { createSignInUseCase } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";
import { setAuthCookies } from "@/lib/infrastructure/identity/AuthCookies";
import { clearAuthCookies } from "@/lib/infrastructure/identity/AuthCookies";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler-client";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();

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
  const supabaseResponse = NextResponse.json({ success: true });
  const supabase = createRouteHandlerClient(request, supabaseResponse);
  const { data: supabaseAuth, error: supabaseError } = await supabase.auth.signInWithPassword({ email, password });
  if (!supabaseError && supabaseAuth.user) {
    const { data: profile, error: profileError } = await supabaseServer.from("profiles").select("clinic_id,role").eq("id", supabaseAuth.user.id).maybeSingle();
    if (profileError || !profile?.clinic_id || !["super_admin", "owner", "manager", "receptionist", "dentist", "doctor"].includes(profile.role)) {
      return NextResponse.json({ error: "This account is not ready for dashboard access. Contact an administrator." }, { status: 403 });
    }
    clearAuthCookies(supabaseResponse);
    return supabaseResponse;
  }

  try {
    bootstrapInfrastructure();
    const result = await createSignInUseCase().execute({
      email,
      password,
      ipAddress: request.headers.get("x-forwarded-for") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
    const response = NextResponse.json({ user: result.user, expiresAt: result.expiresAt });
    setAuthCookies(response, result.accessToken, result.refreshToken, result.expiresAt);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    const status = message === "Invalid email or password." || message === "User account is inactive." || message === "User account is locked." ? 401 : 500;
    return NextResponse.json({ error: status === 401 ? message : "Unable to sign in." }, { status });
  }
}
