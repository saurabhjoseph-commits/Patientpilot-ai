import "server-only";

import { supabaseServer } from "@/lib/supabase-server";

export type DoctorDependencyCounts = Readonly<Record<string, number>>;

async function count(table: string, clinicId: string, doctorId: string): Promise<[string, number]> {
  const { count: total, error } = await supabaseServer.from(table).select("id", { count: "exact", head: true }).eq("clinic_id", clinicId).eq("doctor_id", doctorId);
  if (error) throw new Error(`Unable to verify ${table} before doctor deletion.`);
  return [table, total ?? 0];
}

export async function doctorDependencyCounts(clinicId: string, doctorId: string, authUserId: string | null): Promise<DoctorDependencyCounts> {
  const rows = await Promise.all([
    count("appointments", clinicId, doctorId), count("doctor_services", clinicId, doctorId),
    count("doctor_schedules", clinicId, doctorId), count("doctor_leave", clinicId, doctorId),
    count("blocked_time", clinicId, doctorId), count("doctor_room_assignments", clinicId, doctorId),
  ]);
  if (authUserId) {
    const { count: profiles, error } = await supabaseServer.from("profiles").select("id", { count: "exact", head: true }).eq("id", authUserId).eq("clinic_id", clinicId);
    if (error) throw new Error("Unable to verify the linked doctor profile before deletion.");
    rows.push(["profiles", profiles ?? 0]);
  }
  return Object.fromEntries(rows);
}

export function protectedDoctorDependencies(counts: DoctorDependencyCounts): string[] {
  return Object.entries(counts).filter(([, total]) => total > 0).map(([table]) => table);
}
