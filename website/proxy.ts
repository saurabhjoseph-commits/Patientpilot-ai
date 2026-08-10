import { NextResponse, type NextRequest } from "next/server";
import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { createIdentityAuthenticationService } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";
import { getCompatibilityIdentity } from "@/lib/infrastructure/identity/SupabaseAuthCompatibilityAdapter";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("pp_access_token")?.value;
  const refreshToken = request.cookies.get("pp_refresh_token")?.value;
  const isApi = request.nextUrl.pathname.startsWith("/api/");
  let identity = null;
  if (accessToken && refreshToken) {
    bootstrapInfrastructure();
    identity = await createIdentityAuthenticationService().validate(accessToken, refreshToken);
  }
  const compatibility = identity ? null : await getCompatibilityIdentity(request);
  identity ??= compatibility?.identity ?? null;
  if (!identity) return unauthenticated(request, isApi);
  if (compatibility?.identity?.requiresPasswordChange) return isApi ? NextResponse.json({ error: "Password change required" }, { status: 403 }) : NextResponse.redirect(new URL("/set-password", request.url));
  const headers = new Headers(request.headers);
  headers.set("x-identity-user-id", identity.userId);
  headers.set("x-identity-tenant-id", identity.tenantId);
  headers.set("x-identity-clinic-id", identity.clinicId);
  headers.set("x-identity-role-codes", identity.roleCodes.join(","));
  headers.set("x-identity-permission-codes", identity.permissionCodes.join(","));
  const response = NextResponse.next({ request: { headers } });
  return compatibility ? compatibility.applyCookies(response) : response;
}

function unauthenticated(request: NextRequest, isApi: boolean): NextResponse {
  return isApi ? NextResponse.json({ error: "Unauthorized" }, { status: 401 }) : NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/api/appointments", "/api/calls", "/api/transcript", "/api/test-console", "/api/leads/:path*"] };
