import "server-only";
import { supabaseServer } from "@/lib/supabase-server";

export async function appointmentFormData(clinicId: string) {
  const [{ data: serviceRows, error: serviceError }, { data: doctorRows, error: doctorError }, { data: assignmentRows, error: assignmentError }, { data: roomRows, error: roomError }] = await Promise.all([supabaseServer.from("clinic_services").select("id,name,default_duration_minutes").eq("clinic_id", clinicId).eq("active", true).order("name"), supabaseServer.from("doctors").select("id,full_name").eq("clinic_id", clinicId).eq("status", "active").order("full_name"), supabaseServer.from("doctor_services").select("doctor_id,service_id,custom_duration_minutes").eq("clinic_id", clinicId).eq("active", true), supabaseServer.from("clinic_rooms").select("id,name").eq("clinic_id", clinicId).eq("active", true).order("name")]);
  if (serviceError || doctorError || assignmentError || roomError) throw new Error("Unable to load clinic scheduling options.");
  const assignments = assignmentRows ?? [];
  return { services: (serviceRows ?? []).map((row) => ({ id: row.id, name: row.name, defaultDurationMinutes: row.default_duration_minutes })), doctors: (doctorRows ?? []).map((doctor) => ({ id: doctor.id, fullName: doctor.full_name, serviceIds: assignments.filter((assignment) => assignment.doctor_id === doctor.id).map((assignment) => assignment.service_id), durationByService: Object.fromEntries(assignments.filter((assignment) => assignment.doctor_id === doctor.id).map((assignment) => [assignment.service_id, assignment.custom_duration_minutes])) })), rooms: roomRows ?? [] };
}
