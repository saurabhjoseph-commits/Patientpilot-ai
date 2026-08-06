import { supabaseServer } from "@/lib/supabase-server";
import { toDoctor, type DoctorRow } from "./mapper";
import type { CreateDoctorInput, Doctor, DoctorFilters, DoctorPage, DoctorServiceAssignment, UpdateDoctorInput } from "./types";

const TABLE = "doctors";
const COLUMNS = "id,clinic_id,auth_user_id,full_name,email,phone,qualification,specialisation,registration_number,languages,profile_photo_url,default_appointment_duration_minutes,status,created_at,updated_at";

export class DoctorRepository {
  async list(filters: DoctorFilters): Promise<DoctorPage> {
    const page = Math.max(filters.page ?? 1, 1); const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100);
    let query = supabaseServer.from(TABLE).select(COLUMNS, { count: "exact" }).eq("clinic_id", filters.clinicId);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.query) query = query.or(`full_name.ilike.%${escapeFilter(filters.query)}%,email.ilike.%${escapeFilter(filters.query)}%,specialisation.ilike.%${escapeFilter(filters.query)}%`);
    const { data, error, count } = await query.order(filters.sort === "created" ? "created_at" : "full_name", { ascending: filters.sort !== "created" }).range((page - 1) * pageSize, page * pageSize - 1);
    if (error) throw error;
    return { doctors: (data as DoctorRow[] ?? []).map(toDoctor), total: count ?? 0, page, pageSize };
  }

  async findById(clinicId: string, id: string): Promise<Doctor | null> {
    const { data, error } = await supabaseServer.from(TABLE).select(COLUMNS).eq("clinic_id", clinicId).eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? toDoctor(data as DoctorRow) : null;
  }

  async create(input: CreateDoctorInput): Promise<Doctor> {
    const { data, error } = await supabaseServer.from(TABLE).insert(toCreateRow(input)).select(COLUMNS).single();
    if (error) throw error;
    return toDoctor(data as DoctorRow);
  }

  async update(clinicId: string, id: string, input: UpdateDoctorInput): Promise<Doctor> {
    const { data, error } = await supabaseServer.from(TABLE).update(toUpdateRow(input)).eq("clinic_id", clinicId).eq("id", id).select(COLUMNS).single();
    if (error) throw error;
    return toDoctor(data as DoctorRow);
  }

  async replaceServices(clinicId: string, doctorId: string, assignments: readonly DoctorServiceAssignment[]): Promise<void> {
    if (assignments.length) {
      const ids = assignments.map((assignment) => assignment.serviceId);
      const { count, error: servicesError } = await supabaseServer.from("clinic_services").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId).in("id", ids);
      if (servicesError) throw servicesError;
      if (count !== new Set(ids).size) throw new Error("One or more selected services do not belong to this clinic.");
    }
    const { error: removed } = await supabaseServer.from("doctor_services").delete().eq("clinic_id", clinicId).eq("doctor_id", doctorId);
    if (removed) throw removed;
    if (!assignments.length) return;
    const { error } = await supabaseServer.from("doctor_services").insert(assignments.map((assignment) => ({ clinic_id: clinicId, doctor_id: doctorId, service_id: assignment.serviceId, active: assignment.active, custom_duration_minutes: assignment.customDurationMinutes ?? null, custom_price: assignment.customPrice ?? null })));
    if (error) throw error;
  }

  async assignedServiceIds(clinicId: string, doctorId: string): Promise<readonly string[]> {
    const { data, error } = await supabaseServer.from("doctor_services").select("service_id").eq("clinic_id", clinicId).eq("doctor_id", doctorId).eq("active", true);
    if (error) throw error;
    return (data ?? []).map((row) => String(row.service_id));
  }

  async scheduleSummaries(clinicId: string, doctorIds: readonly string[]): Promise<Readonly<Record<string, string>>> {
    if (!doctorIds.length) return {};
    const { data, error } = await supabaseServer.from("doctor_schedules").select("doctor_id,weekday,start_time,end_time").eq("clinic_id", clinicId).eq("active", true).in("doctor_id", doctorIds).order("weekday");
    if (error) throw error;
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const summaries: Record<string, string> = {};
    for (const row of data ?? []) if (!summaries[String(row.doctor_id)]) summaries[String(row.doctor_id)] = `${weekdays[Number(row.weekday)] ?? "Day"} ${String(row.start_time).slice(0, 5)}–${String(row.end_time).slice(0, 5)}`;
    return summaries;
  }
}

function toCreateRow(input: CreateDoctorInput) { return { clinic_id: input.clinicId, full_name: input.fullName.trim(), email: input.email.trim().toLowerCase(), phone: input.phone?.trim() || null, qualification: input.qualification?.trim() || null, specialisation: input.specialisation?.trim() || null, registration_number: input.registrationNumber?.trim() || null, languages: input.languages?.map((language) => language.trim()).filter(Boolean) ?? [], profile_photo_url: input.profilePhotoUrl ?? null, default_appointment_duration_minutes: input.defaultAppointmentDurationMinutes, status: "active" }; }
function toUpdateRow(input: UpdateDoctorInput) { const updates: Record<string, unknown> = {}; if (input.fullName !== undefined) updates.full_name = input.fullName.trim(); if (input.email !== undefined) updates.email = input.email.trim().toLowerCase(); if (input.phone !== undefined) updates.phone = input.phone.trim() || null; if (input.qualification !== undefined) updates.qualification = input.qualification.trim() || null; if (input.specialisation !== undefined) updates.specialisation = input.specialisation.trim() || null; if (input.registrationNumber !== undefined) updates.registration_number = input.registrationNumber.trim() || null; if (input.languages !== undefined) updates.languages = input.languages.map((language) => language.trim()).filter(Boolean); if (input.profilePhotoUrl !== undefined) updates.profile_photo_url = input.profilePhotoUrl || null; if (input.defaultAppointmentDurationMinutes !== undefined) updates.default_appointment_duration_minutes = input.defaultAppointmentDurationMinutes; if (input.status !== undefined) updates.status = input.status; return updates; }
function escapeFilter(value: string): string { return value.replace(/[%_,()]/g, " ").trim(); }
