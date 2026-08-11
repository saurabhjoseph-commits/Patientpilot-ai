import { cookies } from "next/headers";
import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { createIdentityAuthenticationService } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";
import { redirect } from "next/navigation";
import type { CatalogPermission } from "@/lib/platform/domain/identity";
import { createClient } from "@/lib/supabase/server";
import { DefaultRolePolicies } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import { requiresOwnerPasswordChange } from "@/lib/clinic/owner-onboarding";

export async function getCurrentUser() {
  // Supabase Auth plus profiles is the authoritative launch identity. Check it
  // before legacy cookies so an old platform session cannot impersonate a tenant.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile, error } = await supabaseServer.from("profiles").select("clinic_id,role").eq("id", user.id).maybeSingle();
    if (error) throw error;
    const roleMap: Record<string, string> = { super_admin: "super-admin", owner: "clinic-owner", manager: "practice-manager", receptionist: "receptionist", dentist: "dentist", doctor: "dentist" };
    const roleCode = profile?.role ? roleMap[profile.role] : undefined;
    if (!profile?.clinic_id || !roleCode) return null;
    return { userId: user.id, clinicId: profile.clinic_id, tenantId: profile.clinic_id, roleCodes: [roleCode], permissionCodes: DefaultRolePolicies[roleCode] ?? [], requiresPasswordChange: profile.role === "owner" && await requiresOwnerPasswordChange(user.id) };
  }
  const store = await cookies();
  const accessToken = store.get("pp_access_token")?.value;
  const refreshToken = store.get("pp_refresh_token")?.value;
  if (accessToken && refreshToken) {
    bootstrapInfrastructure();
    const identity = await createIdentityAuthenticationService().validate(accessToken, refreshToken);
    if (identity) return identity;
  }
  return null;
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

export async function requireAdminPageAnyPermission(permissions: readonly CatalogPermission[]) {
  const identity = await getCurrentUser();
  if (!identity) redirect("/login");
  if (!permissions.some((permission) => identity.permissionCodes.includes(permission))) redirect("/admin");
  return identity;
}
