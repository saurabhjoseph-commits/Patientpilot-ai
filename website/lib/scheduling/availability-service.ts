import "server-only";
import { supabaseServer } from "@/lib/supabase-server";
import { getClinicOperationalReadiness } from "@/lib/clinic/operational-readiness";
import { checkSlotAvailability, getAvailableSlots, type AvailabilityInput, type AvailabilityResult } from "./availability";

type Row = Record<string, unknown>;
export type AuthoritativeAvailabilityRequest = { clinicId: string; serviceId: string; date: string; startTime?: string; doctorId?: string; durationMinutes: number; excludeAppointmentId?: string; now?: Date };

/**
 * The only database-backed availability entry point. It loads a bounded clinic/date
 * snapshot once, then delegates all candidate calculations to the pure engine.
 */
export async function checkAuthoritativeSlot(request: AuthoritativeAvailabilityRequest): Promise<AvailabilityResult> {
  const snapshot = await loadSnapshot(request);
  return request.startTime
    ? checkSlotAvailability({ ...snapshot, startTime: request.startTime, excludeAppointmentId: request.excludeAppointmentId, now: request.now })
    : getAvailableSlots({ ...snapshot, excludeAppointmentId: request.excludeAppointmentId, now: request.now });
}

export async function getAuthoritativeAvailableSlots(request: Omit<AuthoritativeAvailabilityRequest, "startTime"> & { fromTime?: string; limit?: number }): Promise<AvailabilityResult> {
  const snapshot = await loadSnapshot(request);
  return getAvailableSlots({ ...snapshot, excludeAppointmentId: request.excludeAppointmentId, now: request.now }, request.fromTime, request.limit);
}

async function loadSnapshot(request: Omit<AuthoritativeAvailabilityRequest, "startTime">): Promise<Omit<AvailabilityInput, "startTime">> {
  const [readiness, clinicResult, settingsResult, serviceResult, doctorsResult, assignmentsResult, schedulesResult, leaveResult, blocksResult, roomsResult, roomAssignmentsResult, appointmentsResult] = await Promise.all([
    getClinicOperationalReadiness(request.clinicId),
    supabaseServer.from("clinics").select("timezone").eq("id", request.clinicId).maybeSingle(),
    supabaseServer.from("clinic_settings").select("office_hours,minimum_booking_notice_minutes,maximum_booking_horizon_days,slot_interval_minutes").eq("clinic_id", request.clinicId).maybeSingle(),
    supabaseServer.from("clinic_services").select("id,active").eq("clinic_id", request.clinicId).eq("id", request.serviceId).maybeSingle(),
    supabaseServer.from("doctors").select("id,status").eq("clinic_id", request.clinicId),
    supabaseServer.from("doctor_services").select("doctor_id,service_id,active,custom_duration_minutes").eq("clinic_id", request.clinicId),
    supabaseServer.from("doctor_schedules").select("doctor_id,weekday,start_time,end_time,effective_from,effective_to,active").eq("clinic_id", request.clinicId),
    supabaseServer.from("doctor_leave").select("doctor_id,starts_on,ends_on,active").eq("clinic_id", request.clinicId),
    supabaseServer.from("blocked_time").select("doctor_id,room_id,starts_at,ends_at,active").eq("clinic_id", request.clinicId),
    supabaseServer.from("clinic_rooms").select("id,active").eq("clinic_id", request.clinicId),
    supabaseServer.from("doctor_room_assignments").select("doctor_id,room_id,effective_from,effective_to,active").eq("clinic_id", request.clinicId),
    supabaseServer.from("appointments").select("id,doctor_id,room_id,appointment_date,appointment_time,duration_minutes,status").eq("clinic_id", request.clinicId).eq("appointment_date", request.date),
  ]);
  const failure = [clinicResult, settingsResult, serviceResult, doctorsResult, assignmentsResult, schedulesResult, leaveResult, blocksResult, roomsResult, roomAssignmentsResult, appointmentsResult].find((result) => result.error);
  if (failure?.error) throw failure.error;
  const clinic = clinicResult.data as Row | null;
  const settings = settingsResult.data as Row | null;
  const service = serviceResult.data as Row | null;
  const nonNegativeInteger = (value: unknown, fallback: number) => typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : fallback;
  const positiveInteger = (value: unknown, fallback: number) => typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
  const officeHours = settings?.office_hours;
  return {
    clinicReady: readiness.h3Ready && service?.active === true,
    timezone: typeof clinic?.timezone === "string" ? clinic.timezone : "UTC",
    date: request.date,
    serviceId: request.serviceId,
    doctorId: request.doctorId,
    durationMinutes: request.durationMinutes,
    intervalMinutes: positiveInteger(settings?.slot_interval_minutes, 15),
    minimumNoticeMinutes: nonNegativeInteger(settings?.minimum_booking_notice_minutes, 0),
    maximumHorizonDays: positiveInteger(settings?.maximum_booking_horizon_days, 1),
    officeHours: isOfficeHours(officeHours) ? officeHours : {},
    doctors: rows(doctorsResult.data).map((row) => ({ id: String(row.id), active: row.status === "active" })),
    assignments: rows(assignmentsResult.data).map((row) => ({ doctorId: String(row.doctor_id), serviceId: String(row.service_id), active: row.active === true, durationMinutes: numberOrNull(row.custom_duration_minutes) })),
    schedules: rows(schedulesResult.data).map((row) => ({ doctorId: String(row.doctor_id), weekday: Number(row.weekday), start: String(row.start_time), end: String(row.end_time), active: row.active === true, effectiveFrom: stringOrNull(row.effective_from), effectiveTo: stringOrNull(row.effective_to) })),
    leave: rows(leaveResult.data).map((row) => ({ doctorId: String(row.doctor_id), startsOn: String(row.starts_on), endsOn: String(row.ends_on), active: row.active === true })),
    blocks: rows(blocksResult.data).map((row) => ({ doctorId: stringOrNull(row.doctor_id), roomId: stringOrNull(row.room_id), startsAt: localTimestamp(String(row.starts_at), typeof clinic?.timezone === "string" ? clinic.timezone : "UTC"), endsAt: localTimestamp(String(row.ends_at), typeof clinic?.timezone === "string" ? clinic.timezone : "UTC"), active: row.active === true })),
    rooms: rows(roomsResult.data).map((row) => ({ id: String(row.id), active: row.active === true })),
    roomAssignments: rows(roomAssignmentsResult.data).map((row) => ({ doctorId: String(row.doctor_id), roomId: String(row.room_id), active: row.active === true, effectiveFrom: stringOrNull(row.effective_from), effectiveTo: stringOrNull(row.effective_to) })),
    appointments: rows(appointmentsResult.data).map((row) => ({ id: String(row.id), doctorId: stringOrNull(row.doctor_id), roomId: stringOrNull(row.room_id), date: String(row.appointment_date), time: String(row.appointment_time), durationMinutes: numberOrNull(row.duration_minutes), status: String(row.status) })),
  };
}

function rows(value: unknown): Row[] { return Array.isArray(value) ? value.filter((row): row is Row => Boolean(row) && typeof row === "object") : []; }
function stringOrNull(value: unknown): string | null { return typeof value === "string" ? value : null; }
function numberOrNull(value: unknown): number | null { return typeof value === "number" ? value : null; }
function isOfficeHours(value: unknown): value is Record<string, { enabled: boolean; open: string; close: string }> { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function localTimestamp(value: string, timezone: string): string { const date = new Date(value); if (Number.isNaN(date.getTime())) return value; const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value])); return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`; }
