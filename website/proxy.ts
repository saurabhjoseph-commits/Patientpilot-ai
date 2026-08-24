import { NextResponse, type NextRequest } from "next/server";
import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { createIdentityAuthenticationService } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";
import { getCompatibilityIdentity } from "@/lib/infrastructure/identity/SupabaseAuthCompatibilityAdapter";
import { getApplicationOrigin, shouldRedirectToCanonicalHost } from "@/lib/config/app";
import type { AuthenticatedIdentity } from "@/lib/infrastructure/identity/IdentityAuthenticationService";

export async function proxy(request: NextRequest) {
  if (shouldRedirectToCanonicalHost(request.nextUrl.hostname)) {
    const canonical = new URL(request.nextUrl.pathname + request.nextUrl.search, getApplicationOrigin());
    return NextResponse.redirect(canonical, 308);
  }
  // Credential entry and recovery endpoints must reach their Route Handlers
  // without attempting compatibility identity validation first.
  if (request.nextUrl.pathname.startsWith("/api/auth/")) return NextResponse.next();
  const protectedPath = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin/") || ["/api/appointments", "/api/calls", "/api/transcript", "/api/test-console"].includes(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith("/api/leads/");
  if (!protectedPath) return NextResponse.next();
  const isApi = request.nextUrl.pathname.startsWith("/api/");
  const compatibility = await getCompatibilityIdentity(request);
  let identity: AuthenticatedIdentity | null = compatibility.identity;
  const accessToken = request.cookies.get("pp_access_token")?.value;
  const refreshToken = request.cookies.get("pp_refresh_token")?.value;
  if (!identity && accessToken && refreshToken) {
    bootstrapInfrastructure();
    identity = await createIdentityAuthenticationService().validate(accessToken, refreshToken);
  }
  if (!identity) return unauthenticated(request, isApi);
  if (compatibility.identity?.requiresPasswordChange) return isApi ? NextResponse.json({ error: "Password change required" }, { status: 403 }) : NextResponse.redirect(new URL("/set-password", request.url));
  const headers = new Headers(request.headers);
  headers.set("x-identity-user-id", identity.userId);
  headers.set("x-identity-tenant-id", identity.tenantId);
  headers.set("x-identity-clinic-id", identity.clinicId);
  headers.set("x-identity-role-codes", identity.roleCodes.join(","));
  headers.set("x-identity-permission-codes", identity.permissionCodes.join(","));
  const response = NextResponse.next({ request: { headers } });
  return compatibility.applyCookies(response);
}

function unauthenticated(request: NextRequest, isApi: boolean): NextResponse {
  return isApi ? NextResponse.json({ error: "Unauthorized" }, { status: 401 }) : NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/api/appointments", "/api/calls", "/api/transcript", "/api/test-console", "/api/leads/:path*", "/auth/callback", "/set-password", "/reset-password", "/login", "/forgot-password"] };
