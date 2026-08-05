/**
 * TEMPORARY India-launch adapter. Remove after full public Identity persistence
 * is migrated and verified. Supabase Auth remains the credential/session source.
 */
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { DefaultRolePolicies } from "@/lib/platform/domain/identity";
import { env } from "@/lib/config/env";
import { supabaseServer } from "@/lib/supabase-server";

export interface CompatibilityIdentity { userId: string; tenantId: string; clinicId: string; roleCodes: readonly string[]; permissionCodes: readonly string[]; }
const roleMap: Record<string, string> = { super_admin: "super-admin", owner: "clinic-owner", manager: "practice-manager", receptionist: "receptionist", dentist: "dentist" };

export async function getCompatibilityIdentity(request: NextRequest): Promise<CompatibilityIdentity | null> {
  const auth = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, { cookies: { getAll: () => request.cookies.getAll(), setAll: () => undefined } });
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return null;
  const { data: profile, error } = await supabaseServer.from("profiles").select("clinic_id,role").eq("id", user.id).maybeSingle();
  if (error || !profile?.clinic_id || !profile.role) return null;
  const roleCode = roleMap[profile.role];
  if (!roleCode) return null;
  return { userId: user.id, clinicId: profile.clinic_id, tenantId: profile.clinic_id, roleCodes: [roleCode], permissionCodes: DefaultRolePolicies[roleCode] ?? [] };
}
