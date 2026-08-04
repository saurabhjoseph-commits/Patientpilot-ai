import { cookies } from "next/headers";
import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { createIdentityAuthenticationService } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";
import { redirect } from "next/navigation";
import type { CatalogPermission } from "@/lib/platform/domain/identity";

export async function getCurrentUser() {
  const store = await cookies();
  const accessToken = store.get("pp_access_token")?.value;
  const refreshToken = store.get("pp_refresh_token")?.value;
  if (!accessToken || !refreshToken) return null;
  bootstrapInfrastructure();
  return createIdentityAuthenticationService().validate(accessToken, refreshToken);
}

export async function isAuthenticated() {
  return (await getCurrentUser()) !== null;
}

export async function requireAdminPagePermission(permission: CatalogPermission) {
  const identity = await getCurrentUser();
  if (!identity) redirect("/login");
  if (!identity.permissionCodes.includes(permission)) redirect("/admin");
  return identity;
}
