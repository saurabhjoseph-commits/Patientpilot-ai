import "server-only";

import type { AppointmentData } from "./core";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";
import { getClinicOperationalReadiness } from "@/lib/clinic/operational-readiness";
import { supabaseServer } from "@/lib/supabase-server";
import { checkAuthoritativeSlot, getAuthoritativeAvailableSlots } from "@/lib/scheduling/availability-service";

export type ClinicBookingResolution =
  | { readonly ok: true; readonly serviceId: string; readonly serviceName: string; readonly doctorId: string; readonly doctorName: string; readonly roomId: string }
  | { readonly ok: false; readonly reason: string };

/** Resolves AI wording against trusted clinic scheduling configuration; it never accepts model IDs. */
export async function resolveClinicBooking(scope: ClinicScope, appointment: AppointmentData): Promise<ClinicBookingResolution> {
  const readiness = await getClinicOperationalReadiness(scope.clinicId);
  if (!readiness.h3Ready) return { ok: false, reason: "This clinic is not ready to accept AI bookings." };
  const requestedService = normalize(appointment.reason ?? appointment.procedure ?? "");
  if (!requestedService) return { ok: false, reason: "Please ask which clinic service the patient needs." };
  const { data: services, error: serviceError } = await supabaseServer.from("clinic_services").select("id,name,default_duration_minutes").eq("clinic_id", scope.clinicId).eq("active", true);
  if (serviceError) throw serviceError;
  const serviceMatches = (services ?? []).filter((service) => matchesService(normalize(service.name), requestedService));
  if (serviceMatches.length !== 1) return { ok: false, reason: serviceMatches.length ? "Please clarify which clinic service the patient needs." : "The requested service is not available at this clinic." };
  const service = serviceMatches[0];
  const { data: assignments, error: assignmentError } = await supabaseServer.from("doctor_services").select("doctor_id,custom_duration_minutes").eq("clinic_id", scope.clinicId).eq("service_id", service.id).eq("active", true);
  if (assignmentError) throw assignmentError;
  const doctorIds = [...new Set((assignments ?? []).map((assignment) => assignment.doctor_id))];
  if (!doctorIds.length) return { ok: false, reason: "No eligible doctor is configured for that service." };
  const { data: doctors, error: doctorError } = await supabaseServer.from("doctors").select("id,full_name").eq("clinic_id", scope.clinicId).eq("status", "active").in("id", doctorIds);
  if (doctorError) throw doctorError;
  const requestedDoctor = normalize(appointment.dentist ?? "");
  const eligibleDoctors = requestedDoctor ? (doctors ?? []).filter((doctor) => normalize(doctor.full_name) === requestedDoctor) : doctors ?? [];
  if (eligibleDoctors.length !== 1) return { ok: false, reason: eligibleDoctors.length ? "Please clarify which doctor the patient prefers." : "The requested doctor cannot provide that service." };
  const doctor = eligibleDoctors[0];
  const date = appointment.appointmentDate ?? appointment.preferredDate ?? "";
  const time = appointment.appointmentTime ?? appointment.preferredTime ?? "";
  const assignment = (assignments ?? []).find((row) => row.doctor_id === doctor.id);
  const durationMinutes = assignment?.custom_duration_minutes ?? service.default_duration_minutes;
  if (!date || !time || !Number.isInteger(durationMinutes) || durationMinutes <= 0) return { ok: false, reason: "Please clarify the requested appointment time." };
  const availability = await checkAuthoritativeSlot({ clinicId: scope.clinicId, serviceId: service.id, doctorId: doctor.id, date, startTime: time, durationMinutes });
  if (!availability.available) {
    const alternatives = await getAuthoritativeAvailableSlots({ clinicId: scope.clinicId, serviceId: service.id, doctorId: doctor.id, date, durationMinutes, fromTime: time, limit: 3 });
    const offer = alternatives.slots.map((slot) => slot.startTime).join(", ");
    return { ok: false, reason: offer ? `That time is unavailable. Available alternatives are ${offer}.` : "That time is unavailable and no alternative is currently configured." };
  }
  return { ok: true, serviceId: service.id, serviceName: service.name, doctorId: doctor.id, doctorName: doctor.full_name, roomId: availability.slots[0].roomId };
}

export function normalizeClinicAppointmentDateTime(dateValue: string, timeValue: string, timezone: string, now = new Date()): { date: string; time: string } | null {
  const date = normalizeDate(dateValue, timezone, now);
  const time = normalizeTime(timeValue);
  return date && time ? { date, time } : null;
}

function normalize(value: string): string { return value.trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " "); }
function matchesService(service: string, requested: string): boolean { return service === requested || service.includes(requested) || requested.includes(service); }
function normalizeDate(value: string, timezone: string, now: Date): string | null {
  const text = value.trim().toLowerCase();
  if (isCalendarDate(text)) return text;
  const today = zonedDate(now, timezone);
  if (!today) return null;
  if (text === "today") return today;
  if (text === "tomorrow") return shiftDate(today, 1);
  const weekday = text.replace(/^next\s+/, "");
  const target = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(weekday);
  if (target < 0) return null;
  const current = new Date(`${today}T00:00:00Z`).getUTCDay();
  return shiftDate(today, ((target - current + 7) % 7) || 7);
}

function normalizeTime(value: string): string | null {
  const text = value.trim();
  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(text)) return text;
  const match = /^(0?[1-9]|1[0-2])(?::([0-5]\d))?\s*(am|pm)$/i.exec(text);
  if (!match) return null;
  let hour = Number(match[1]);
  if (match[3].toLowerCase() === "pm" && hour !== 12) hour += 12;
  if (match[3].toLowerCase() === "am" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${match[2] ?? "00"}`;
}

function isCalendarDate(value: string): boolean { if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const [year, month, day] = value.split("-").map(Number); const date = new Date(Date.UTC(year, month - 1, day)); return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day; }
function zonedDate(now: Date, timezone: string): string | null { try { const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now); const values = Object.fromEntries(parts.map((part) => [part.type, part.value])); return `${values.year}-${values.month}-${values.day}`; } catch { return null; } }
function shiftDate(date: string, days: number): string { const value = new Date(`${date}T00:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10); }
