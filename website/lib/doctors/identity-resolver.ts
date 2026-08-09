import "server-only";

import { supabaseServer } from "@/lib/supabase-server";

export interface DoctorIdentity { readonly doctorId: string; readonly clinicId: string; }

/** Resolves only an authenticated profile and active doctor in the same clinic. */
export async function resolveDoctorIdentity(authUserId: string): Promise<DoctorIdentity | null> {
  const { data: profile, error: profileError } = await supabaseServer.from("profiles").select("id,clinic_id,role").eq("id", authUserId).maybeSingle();
  if (profileError) throw profileError;
  if (!profile?.clinic_id || (profile.role !== "doctor" && profile.role !== "dentist")) return null;
  const { data: doctors, error: doctorError } = await supabaseServer.from("doctors").select("id,clinic_id,status").eq("auth_user_id", authUserId).eq("clinic_id", profile.clinic_id).eq("status", "active");
  if (doctorError) throw doctorError;
  if (!doctors || doctors.length !== 1) return null;
  return { doctorId: doctors[0].id, clinicId: doctors[0].clinic_id };
}
