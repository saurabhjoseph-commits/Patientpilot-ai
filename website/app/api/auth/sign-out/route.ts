import { NextResponse, type NextRequest } from "next/server";
import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { clearAuthCookies } from "@/lib/infrastructure/identity/AuthCookies";
import { createSignOutUseCase } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  const token = request.cookies.get("pp_refresh_token")?.value;
  if (token) {
    try { bootstrapInfrastructure(); await createSignOutUseCase().execute(token); } catch { /* Cookie deletion remains idempotent. */ }
  }
  clearAuthCookies(response);
  return response;
}
