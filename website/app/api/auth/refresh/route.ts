import { NextResponse, type NextRequest } from "next/server";
import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { clearAuthCookies, setAuthCookies } from "@/lib/infrastructure/identity/AuthCookies";
import { createRefreshTokenUseCase } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("pp_refresh_token")?.value;
  if (!refreshToken) return NextResponse.json({ error: "Refresh token is required." }, { status: 401 });
  try {
    bootstrapInfrastructure();
    const tokens = await createRefreshTokenUseCase().execute(refreshToken);
    const response = NextResponse.json({ expiresAt: tokens.expiresAt });
    setAuthCookies(response, tokens.accessToken, tokens.refreshToken, tokens.expiresAt);
    return response;
  } catch {
    const response = NextResponse.json({ error: "Invalid refresh token." }, { status: 401 });
    clearAuthCookies(response);
    return response;
  }
}
