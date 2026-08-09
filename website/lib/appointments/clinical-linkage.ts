import { supabaseServer } from "@/lib/supabase-server";
import type { CreateAppointmentInput } from "./types";

export async function resolveClinicalLinkage(input: CreateAppointmentInput): Promise<Pick<CreateAppointmentInput, "doctorId" | "serviceId" | "roomId" | "durationMinutes">> {
  const linkage = { doctorId: input.doctorId, serviceId: input.serviceId, roomId: input.roomId, durationMinutes: input.durationMinutes };
  if (!linkage.doctorId && !linkage.serviceId && !linkage.roomId) return linkage;
  if (!linkage.serviceId) throw new Error("A clinic service is required for clinical appointment linkage.");
  const { data: service, error: serviceError } = await supabaseServer.from("clinic_services").select("id,default_duration_minutes").eq("clinic_id", input.clinicId).eq("id", linkage.serviceId).maybeSingle();
  if (serviceError) throw serviceError;
  if (!service) throw new Error("Selected service does not belong to this clinic.");
  let durationMinutes = linkage.durationMinutes ?? service.default_duration_minutes;
  if (linkage.doctorId) {
    const { data: doctor, error: doctorError } = await supabaseServer.from("doctors").select("id").eq("clinic_id", input.clinicId).eq("id", linkage.doctorId).eq("status", "active").maybeSingle();
    if (doctorError) throw doctorError;
    if (!doctor) throw new Error("Selected doctor does not belong to this clinic or is inactive.");
    const { data: assignment, error: assignmentError } = await supabaseServer.from("doctor_services").select("custom_duration_minutes").eq("clinic_id", input.clinicId).eq("doctor_id", linkage.doctorId).eq("service_id", linkage.serviceId).eq("active", true).maybeSingle();
    if (assignmentError) throw assignmentError;
    if (!assignment) throw new Error("Selected doctor is not assigned to this service.");
    durationMinutes = assignment.custom_duration_minutes ?? durationMinutes;
  }
  if (linkage.roomId) { const { data: room, error } = await supabaseServer.from("clinic_rooms").select("id").eq("clinic_id", input.clinicId).eq("id", linkage.roomId).eq("active", true).maybeSingle(); if (error) throw error; if (!room) throw new Error("Selected room does not belong to this clinic or is inactive."); }
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) throw new Error("A positive appointment duration is required.");
  return { ...linkage, durationMinutes };
}
