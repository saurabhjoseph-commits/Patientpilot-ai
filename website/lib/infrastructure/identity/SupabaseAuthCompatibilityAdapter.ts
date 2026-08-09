/**
 * TEMPORARY India-launch adapter. Remove after full public Identity persistence
 * is migrated and verified. Supabase Auth remains the credential/session source.
 */
import type { NextRequest } from "next/server";
import { DefaultRolePolicies } from "@/lib/platform/domain/identity";
import { supabaseServer } from "@/lib/supabase-server";
import { createProxyClient } from "@/lib/supabase/proxy";

export interface CompatibilityIdentity { userId: string; tenantId: string; clinicId: string; roleCodes: readonly string[]; permissionCodes: readonly string[]; }
const roleMap: Record<string, string> = { super_admin: "super-admin", owner: "clinic-owner", manager: "practice-manager", receptionist: "receptionist", dentist: "dentist", doctor: "dentist" };

export async function getCompatibilityIdentity(request: NextRequest) {
  const proxyClient = createProxyClient(request);
  const auth = proxyClient.client;
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return { identity: null, applyCookies: proxyClient.applyCookies };
  const { data: profile, error } = await supabaseServer.from("profiles").select("clinic_id,role").eq("id", user.id).maybeSingle();
  if (error) throw error;
  if (!profile?.clinic_id || !profile.role) return { identity: null, applyCookies: proxyClient.applyCookies };
  const roleCode = roleMap[profile.role];
  if (!roleCode) return { identity: null, applyCookies: proxyClient.applyCookies };
  return { identity: { userId: user.id, clinicId: profile.clinic_id, tenantId: profile.clinic_id, roleCodes: [roleCode], permissionCodes: DefaultRolePolicies[roleCode] ?? [] }, applyCookies: proxyClient.applyCookies };
}
