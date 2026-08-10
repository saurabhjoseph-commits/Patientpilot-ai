import "server-only";

import { bookingPolicyFromPersistence } from "./booking-policy";
import { supabaseServer } from "@/lib/supabase-server";

export interface ClinicReadinessItem { readonly key: string; readonly label: string; readonly ready: boolean; readonly required: boolean; readonly actionHref: string; }
export interface ClinicOperationalReadiness { readonly items: readonly ClinicReadinessItem[]; readonly readyCount: number; readonly requiredCount: number; readonly percentage: number; readonly h3Ready: boolean; readonly policyAvailable: boolean; }

type Row = Record<string, unknown>;
const link = (path: string, clinicId: string) => `${path}${path.includes("?") ? "&" : "?"}clinicId=${encodeURIComponent(clinicId)}`;

export async function getClinicOperationalReadiness(clinicId: string): Promise<ClinicOperationalReadiness> {
  const [clinicResult, settingsResult, servicesResult, doctorsResult, assignmentsResult, schedulesResult, roomsResult, roomAssignmentsResult, appointmentsResult] = await Promise.all([
    supabaseServer.from("clinics").select("timezone").eq("id", clinicId).maybeSingle(),
    supabaseServer.from("clinic_settings").select("office_hours,minimum_booking_notice_minutes,maximum_booking_horizon_days,slot_interval_minutes").eq("clinic_id", clinicId).maybeSingle(),
    supabaseServer.from("clinic_services").select("id,active,default_duration_minutes").eq("clinic_id", clinicId),
    supabaseServer.from("doctors").select("id,status").eq("clinic_id", clinicId),
    supabaseServer.from("doctor_services").select("doctor_id,service_id,active,custom_duration_minutes").eq("clinic_id", clinicId),
    supabaseServer.from("doctor_schedules").select("doctor_id,active,start_time,end_time").eq("clinic_id", clinicId),
    supabaseServer.from("clinic_rooms").select("id,active").eq("clinic_id", clinicId),
    supabaseServer.from("doctor_room_assignments").select("doctor_id,room_id,active,effective_to").eq("clinic_id", clinicId),
    supabaseServer.from("appointments").select("doctor_id,service_id,room_id,duration_minutes").eq("clinic_id", clinicId),
  ]);
  const clinic = (clinicResult.data ?? {}) as Row;
  const settings = (settingsResult.data ?? {}) as Row;
  const policyAvailable = !settingsResult.error;
  const services = (servicesResult.data ?? []) as Row[];
  const doctors = (doctorsResult.data ?? []) as Row[];
  const assignments = (assignmentsResult.data ?? []) as Row[];
  const schedules = (schedulesResult.data ?? []) as Row[];
  const rooms = (roomsResult.data ?? []) as Row[];
  const roomAssignments = (roomAssignmentsResult.data ?? []) as Row[];
  const appointments = (appointmentsResult.data ?? []) as Row[];
  const activeServices = servicesResult.error ? [] : services.filter((row) => row.active === true && positive(row.default_duration_minutes));
  const activeDoctors = doctorsResult.error ? [] : doctors.filter((row) => row.status === "active");
  const activeDoctorIds = new Set(activeDoctors.map((row) => String(row.id)));
  const activeServiceIds = new Set(activeServices.map((row) => String(row.id)));
  const validAssignments = assignmentsResult.error ? [] : assignments.filter((row) => row.active === true && activeDoctorIds.has(String(row.doctor_id)) && activeServiceIds.has(String(row.service_id)) && (row.custom_duration_minutes === null || row.custom_duration_minutes === undefined || positive(row.custom_duration_minutes)));
  const usableSchedules = schedulesResult.error ? [] : schedules.filter((row) => row.active === true && typeof row.start_time === "string" && typeof row.end_time === "string" && row.start_time < row.end_time && activeDoctorIds.has(String(row.doctor_id)));
  const activeRooms = roomsResult.error ? [] : rooms.filter((row) => row.active === true);
  const activeRoomIds = new Set(activeRooms.map((row) => String(row.id)));
  const today = new Date().toISOString().slice(0, 10);
  const validRoomAssignments = roomAssignmentsResult.error ? [] : roomAssignments.filter((row) => row.active === true && activeDoctorIds.has(String(row.doctor_id)) && activeRoomIds.has(String(row.room_id)) && (typeof row.effective_to !== "string" || row.effective_to >= today));
  const linkageCompatible = !appointmentsResult.error && appointments.every((row) => {
    const linked = row.doctor_id !== null || row.service_id !== null || row.room_id !== null;
    return !linked || (row.service_id !== null && positive(row.duration_minutes));
  });
  const policy = bookingPolicyFromPersistence(settings);
  const items: ClinicReadinessItem[] = [
    item("timezone", "Clinic timezone", !clinicResult.error && typeof clinic.timezone === "string" && clinic.timezone.trim().length > 0, `/admin/clinics/${clinicId}`),
    item("office-hours", "Business hours", isOfficeHours(settings.office_hours), `/admin/clinics/${clinicId}`),
    item("booking-policy", "Booking policy", policyAvailable && policy !== null, `/admin/clinics/${clinicId}`),
    item("services", "Active services with valid durations", activeServices.length > 0, link("/admin/services", clinicId)),
    item("doctors", "Active doctors", activeDoctors.length > 0, link("/admin/doctors", clinicId)),
    item("doctor-services", "Doctor-service assignments", validAssignments.length > 0, link("/admin/doctors", clinicId)),
    item("schedules", "Usable doctor schedules", usableSchedules.length > 0, link("/admin/doctors", clinicId)),
    item("rooms", "Active rooms", activeRooms.length > 0, link("/admin/rooms", clinicId)),
    item("room-assignments", "Active doctor-room assignments", validRoomAssignments.length > 0, link("/admin/doctors", clinicId)),
    item("appointment-linkage", "Appointment linkage compatibility", linkageCompatible, link("/admin/appointments", clinicId)),
  ];
  const required = items.filter((entry) => entry.required);
  const readyCount = required.filter((entry) => entry.ready).length;
  return { items, readyCount, requiredCount: required.length, percentage: Math.round((readyCount / required.length) * 100), h3Ready: readyCount === required.length, policyAvailable };
}

function item(key: string, label: string, ready: boolean, actionHref: string): ClinicReadinessItem { return { key, label, ready, required: true, actionHref }; }
function positive(value: unknown): boolean { return typeof value === "number" && Number.isInteger(value) && value > 0; }
function isOfficeHours(value: unknown): boolean { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
