import { cookies } from "next/headers";
import { bootstrapInfrastructure } from "@/lib/infrastructure/dependency-injection/bootstrap";
import { createIdentityAuthenticationService } from "@/lib/infrastructure/identity/IdentityUseCaseFactory";
import { redirect } from "next/navigation";
import type { CatalogPermission } from "@/lib/platform/domain/identity";
import { createClient } from "@/lib/supabase/server";
import { DefaultRolePolicies } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";

export async function getCurrentUser() {
  const store = await cookies();
  const accessToken = store.get("pp_access_token")?.value;
  const refreshToken = store.get("pp_refresh_token")?.value;
  if (accessToken && refreshToken) {
    bootstrapInfrastructure();
    const identity = await createIdentityAuthenticationService().validate(accessToken, refreshToken);
    if (identity) return identity;
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabaseServer.from("profiles").select("clinic_id,role").eq("id", user.id).maybeSingle();
  const roleMap: Record<string, string> = { super_admin: "super-admin", owner: "clinic-owner", manager: "practice-manager", receptionist: "receptionist", dentist: "dentist" };
  const roleCode = profile?.role ? roleMap[profile.role] : undefined;
  if (!profile?.clinic_id || !roleCode) return null;
  return { userId: user.id, clinicId: profile.clinic_id, tenantId: profile.clinic_id, roleCodes: [roleCode], permissionCodes: DefaultRolePolicies[roleCode] ?? [] };
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
