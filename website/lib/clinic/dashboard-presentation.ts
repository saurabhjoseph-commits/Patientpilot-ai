import "server-only";

import type { getCurrentUser } from "@/lib/auth-server";
import { supabaseServer } from "@/lib/supabase-server";

type Identity = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
export interface AdminDashboardPresentation { readonly isPlatformAdmin: boolean; readonly userName: string; readonly clinicName: string | null; readonly dashboardLabel: string; }

export async function getAdminDashboardPresentation(identity: Identity): Promise<AdminDashboardPresentation> {
  const isPlatformAdmin = identity.roleCodes.includes("super-admin");
  if (isPlatformAdmin) return { isPlatformAdmin: true, userName: "Super Admin", clinicName: null, dashboardLabel: "Admin Dashboard" };
  const { data: profile, error: profileError } = await supabaseServer.from("profiles").select("clinic_id,full_name").eq("id", identity.userId).maybeSingle();
  if (profileError || !profile || profile.clinic_id !== identity.clinicId) throw new Error("Unable to resolve the authenticated clinic profile.");
  const { data: clinic, error: clinicError } = await supabaseServer.from("clinics").select("name").eq("id", identity.clinicId).maybeSingle();
  if (clinicError || !clinic?.name) throw new Error("Unable to resolve the authenticated clinic.");
  return { isPlatformAdmin: false, userName: typeof profile.full_name === "string" && profile.full_name.trim() ? profile.full_name.trim() : "Clinic user", clinicName: clinic.name, dashboardLabel: "Clinic Dashboard" };
}
