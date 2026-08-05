import type { NextRequest } from "next/server";
import type { CatalogPermission } from "@/lib/platform/domain/identity";

export interface RequestAuthorizationContext {
  readonly userId: string;
  readonly tenantId: string;
  readonly clinicId: string;
  readonly roleCodes: readonly string[];
  readonly permissionCodes: readonly string[];
}

export function getAuthorizationContext(request: NextRequest): RequestAuthorizationContext | null {
  const userId = request.headers.get("x-identity-user-id");
  const tenantId = request.headers.get("x-identity-tenant-id");
  const clinicId = request.headers.get("x-identity-clinic-id");
  if (!userId || !tenantId || !clinicId) return null;
  return {
    userId,
    tenantId,
    clinicId,
    roleCodes: splitHeader(request.headers.get("x-identity-role-codes")),
    permissionCodes: splitHeader(request.headers.get("x-identity-permission-codes")),
  };
}

export function hasPermission(context: RequestAuthorizationContext, permission: string): boolean {
  return context.permissionCodes.includes(permission);
}

export function requireAuthentication(request: NextRequest): RequestAuthorizationContext | Response {
  return getAuthorizationContext(request) ?? Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function requirePermission(request: NextRequest, permission: CatalogPermission): RequestAuthorizationContext | Response {
  const context = requireAuthentication(request);
  if (context instanceof Response) return context;
  return hasPermission(context, permission) ? context : Response.json({ error: "Forbidden" }, { status: 403 });
}

export function requireAnyPermission(request: NextRequest, permissions: readonly CatalogPermission[]): RequestAuthorizationContext | Response {
  const context = requireAuthentication(request);
  if (context instanceof Response) return context;
  return permissions.some((permission) => hasPermission(context, permission)) ? context : Response.json({ error: "Forbidden" }, { status: 403 });
}

export function requireAllPermissions(request: NextRequest, permissions: readonly CatalogPermission[]): RequestAuthorizationContext | Response {
  const context = requireAuthentication(request);
  if (context instanceof Response) return context;
  return permissions.every((permission) => hasPermission(context, permission)) ? context : Response.json({ error: "Forbidden" }, { status: 403 });
}

export function requireTenantScope(context: RequestAuthorizationContext, tenantId: string): boolean { return context.tenantId === tenantId; }
export function requireClinicScope(context: RequestAuthorizationContext, clinicId: string): boolean { return context.clinicId === clinicId; }

function splitHeader(value: string | null): readonly string[] {
  return value ? value.split(",").filter(Boolean) : [];
}
