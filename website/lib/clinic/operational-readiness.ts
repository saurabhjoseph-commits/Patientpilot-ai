import "server-only";
import { bookingPolicyFromPersistence } from "./booking-policy";
import { supabaseServer } from "@/lib/supabase-server";

export interface ClinicReadinessItem { readonly key: string; readonly label: string; readonly description: string; readonly actionHref: string; readonly actionLabel: string; readonly ready: boolean; readonly required: true; }
export interface ClinicOperationalReadiness { readonly items: readonly ClinicReadinessItem[]; readonly readyCount: number; readonly requiredCount: number; readonly percentage: number; readonly h3Ready: boolean; readonly policyAvailable: boolean; }
type Row = Record<string, unknown>;
const link = (path: string, clinicId: string) => `${path}${path.includes("?") ? "&" : "?"}clinicId=${encodeURIComponent(clinicId)}`;
const today = () => new Date().toISOString().slice(0, 10);
const positive = (value: unknown) => typeof value === "number" && Number.isInteger(value) && value > 0;
const current = (row: Row, date: string) => (typeof row.effective_from !== "string" || row.effective_from <= date) && (typeof row.effective_to !== "string" || row.effective_to >= date);

/** The single server-side definition of the India MVP's ten booking requirements. */
export function evaluateClinicOperationalReadiness(input: { clinic: Row; settings: Row; policyAvailable: boolean; services: Row[]; doctors: Row[]; assignments: Row[]; schedules: Row[]; rooms: Row[]; roomAssignments: Row[]; appointments: Row[]; date?: string }): ClinicOperationalReadiness {
  const date = input.date ?? today(); const activeServices = input.services.filter((row) => row.active === true && positive(row.default_duration_minutes)); const activeDoctors = input.doctors.filter((row) => row.status === "active");
  const doctorIds = new Set(activeDoctors.map((row) => String(row.id))); const serviceIds = new Set(activeServices.map((row) => String(row.id)));
  const assignments = input.assignments.filter((row) => row.active === true && doctorIds.has(String(row.doctor_id)) && serviceIds.has(String(row.service_id)) && (row.custom_duration_minutes === null || row.custom_duration_minutes === undefined || positive(row.custom_duration_minutes)));
  const schedules = input.schedules.filter((row) => row.active === true && doctorIds.has(String(row.doctor_id)) && current(row, date) && typeof row.start_time === "string" && typeof row.end_time === "string" && row.start_time < row.end_time);
  const activeRooms = input.rooms.filter((row) => row.active === true); const roomIds = new Set(activeRooms.map((row) => String(row.id)));
  const roomAssignments = input.roomAssignments.filter((row) => row.active === true && current(row, date) && doctorIds.has(String(row.doctor_id)) && roomIds.has(String(row.room_id)));
  const linkage = input.appointments.every((row) => { const linked = row.doctor_id !== null || row.service_id !== null || row.room_id !== null; return !linked || (row.service_id !== null && positive(row.duration_minutes)); });
  const policy = bookingPolicyFromPersistence(input.settings);
  const item = (key: string, label: string, description: string, actionHref: string, actionLabel: string, ready: boolean): ClinicReadinessItem => ({ key, label, description, actionHref, actionLabel, ready, required: true });
  const items = [
    item("timezone", "Clinic timezone", "Booking times need a clinic-local timezone.", `/admin/clinics/${String(input.clinic.id ?? "")}`, "Set timezone", typeof input.clinic.timezone === "string" && input.clinic.timezone.trim().length > 0),
    item("office-hours", "Business hours", "AI booking must know when your clinic is open.", `/admin/clinics/${String(input.clinic.id ?? "")}`, "Set business hours", Boolean(input.settings.office_hours && typeof input.settings.office_hours === "object" && !Array.isArray(input.settings.office_hours))),
    item("booking-policy", "Booking policy", "Set notice, horizon, and slot interval rules.", `/admin/clinics/${String(input.clinic.id ?? "")}`, "Configure policy", input.policyAvailable && policy !== null),
    item("services", "Active service with valid duration", "A service duration is required to create bookable slots.", link("/admin/services", String(input.clinic.id ?? "")), "Add service", activeServices.length > 0),
    item("doctors", "Active doctor", "Appointments need an available practitioner.", link("/admin/doctors", String(input.clinic.id ?? "")), "Add doctor", activeDoctors.length > 0),
    item("doctor-services", "Doctor-service assignment", "The selected doctor must be able to provide a clinic service.", link("/admin/doctors", String(input.clinic.id ?? "")), "Assign services", assignments.length > 0),
    item("schedules", "Usable doctor schedule", "AI booking needs a current weekly availability period.", link("/admin/doctors", String(input.clinic.id ?? "")), "Configure availability", schedules.length > 0),
    item("rooms", "Active treatment room", "Appointments require an active treatment room.", link("/admin/rooms", String(input.clinic.id ?? "")), "Add room", activeRooms.length > 0),
    item("room-assignments", "Current doctor-room assignment", "An active doctor must be assigned to an active room today.", link("/admin/doctors", String(input.clinic.id ?? "")), "Assign room", roomAssignments.length > 0),
    item("appointment-linkage", "Appointment linkage compatibility", "Existing linked appointments must retain a service and valid duration.", link("/admin/appointments", String(input.clinic.id ?? "")), "Review appointments", linkage),
  ] as const;
  const required = items.filter((entry) => entry.required);
  const readyCount = required.filter((entry) => entry.ready).length;
  return { items, readyCount, requiredCount: required.length, percentage: Math.round((readyCount / required.length) * 100), h3Ready: readyCount === required.length, policyAvailable: input.policyAvailable };
}

export async function getClinicOperationalReadiness(clinicId: string): Promise<ClinicOperationalReadiness> {
  const [clinicResult, settingsResult, servicesResult, doctorsResult, assignmentsResult, schedulesResult, roomsResult, roomAssignmentsResult, appointmentsResult] = await Promise.all([
    supabaseServer.from("clinics").select("id,timezone").eq("id", clinicId).maybeSingle(), supabaseServer.from("clinic_settings").select("office_hours,minimum_booking_notice_minutes,maximum_booking_horizon_days,slot_interval_minutes").eq("clinic_id", clinicId).maybeSingle(), supabaseServer.from("clinic_services").select("id,active,default_duration_minutes").eq("clinic_id", clinicId), supabaseServer.from("doctors").select("id,status").eq("clinic_id", clinicId), supabaseServer.from("doctor_services").select("doctor_id,service_id,active,custom_duration_minutes").eq("clinic_id", clinicId), supabaseServer.from("doctor_schedules").select("doctor_id,active,start_time,end_time,effective_from,effective_to").eq("clinic_id", clinicId), supabaseServer.from("clinic_rooms").select("id,active").eq("clinic_id", clinicId), supabaseServer.from("doctor_room_assignments").select("doctor_id,room_id,active,effective_from,effective_to").eq("clinic_id", clinicId), supabaseServer.from("appointments").select("doctor_id,service_id,room_id,duration_minutes").eq("clinic_id", clinicId),
  ]);
  // Any failed ownership query contributes no qualifying rows: readiness fails closed.
  const appointments = !appointmentsResult.error
    ? (appointmentsResult.data ?? []) as Row[]
    : [{ doctor_id: "invalid", service_id: null, room_id: null, duration_minutes: null }];
  return evaluateClinicOperationalReadiness({ clinic: (clinicResult.data ?? {}) as Row, settings: (settingsResult.data ?? {}) as Row, policyAvailable: !settingsResult.error, services: servicesResult.error ? [] : (servicesResult.data ?? []) as Row[], doctors: doctorsResult.error ? [] : (doctorsResult.data ?? []) as Row[], assignments: assignmentsResult.error ? [] : (assignmentsResult.data ?? []) as Row[], schedules: schedulesResult.error ? [] : (schedulesResult.data ?? []) as Row[], rooms: roomsResult.error ? [] : (roomsResult.data ?? []) as Row[], roomAssignments: roomAssignmentsResult.error ? [] : (roomAssignmentsResult.data ?? []) as Row[], appointments });
}
