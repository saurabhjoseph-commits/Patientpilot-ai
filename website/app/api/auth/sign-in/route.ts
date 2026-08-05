import { NextResponse, type NextRequest } from "next/server";

import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { createSignInUseCase } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";
import { setAuthCookies } from "@/lib/infrastructure/identity/AuthCookies";

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

  try {
    bootstrapInfrastructure();
    const result = await createSignInUseCase().execute({
      email: (body as { email: string }).email,
      password: (body as { password: string }).password,
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
