import "server-only";

import { supabaseServer } from "@/lib/supabase-server";

export type DependencyCounts = Readonly<Record<string, number>>;

async function count(table: string, column: string, value: string): Promise<[string, number]> {
  const { count: total, error } = await supabaseServer.from(table).select("id", { count: "exact", head: true }).eq(column, value);
  if (error) throw new Error(`Unable to verify ${table} before deletion.`);
  return [table, total ?? 0];
}

/** Permanent deletion is deliberately unavailable until every known owner is empty. */
export async function clinicDependencyCounts(clinicId: string, clinicName: string): Promise<DependencyCounts> {
  const rows = await Promise.all([
    count("profiles", "clinic_id", clinicId), count("doctors", "clinic_id", clinicId),
    count("contacts", "clinic_id", clinicId), count("appointments", "clinic_id", clinicId),
    count("calls", "clinic_id", clinicId), count("call_messages", "clinic_id", clinicId),
    count("clinic_settings", "clinic_id", clinicId), count("clinic_services", "clinic_id", clinicId),
    count("doctor_services", "clinic_id", clinicId), count("doctor_schedules", "clinic_id", clinicId),
    count("doctor_leave", "clinic_id", clinicId), count("blocked_time", "clinic_id", clinicId),
    count("clinic_rooms", "clinic_id", clinicId), count("doctor_room_assignments", "clinic_id", clinicId),
    count("clinic_owner_onboarding", "clinic_id", clinicId),
    // These authoritative legacy tables are clinic-name scoped, so a match blocks deletion.
    count("patients", "clinic_name", clinicName), count("call_summaries", "clinic_name", clinicName),
  ]);
  return Object.fromEntries(rows);
}

export function protectedDependencies(counts: DependencyCounts): string[] {
  return Object.entries(counts).filter(([, total]) => total > 0).map(([table]) => table);
}

/** Profile and onboarding rows are clinic-exclusive access mappings with FK cascades.
 * They are checked and captured before deletion, but do not preserve clinical history. */
export function blockingClinicDependencies(counts: DependencyCounts): string[] {
  return protectedDependencies(counts).filter((table) => table !== "profiles" && table !== "clinic_owner_onboarding");
}
