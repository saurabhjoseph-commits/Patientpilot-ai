import { supabaseServer } from "@/lib/supabase-server";

import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
} from "./types";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";
import {
  fromAppointmentPersistence,
  toAppointmentPersistence,
} from "./mapper";

/**
 * ============================================================
 * PatientPilot AI
 * Appointment Repository
 * ============================================================
 *
 * Data access layer for appointments.
 * This is the only module that communicates
 * directly with Supabase.
 * ============================================================
 */

const TABLE = "appointments";

/**
 * Create a new appointment.
 */
export async function createAppointment(
  input: CreateAppointmentInput
): Promise<Appointment> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .insert(toAppointmentPersistence(input))
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromAppointmentPersistence(data);
}

/**
 * Get appointment by ID.
 */
export async function getAppointment(
  id: string,
  scope: ClinicScope,
): Promise<Appointment | null> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .eq("clinic_id", scope.clinicId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? fromAppointmentPersistence(data) : null;
}

/**
 * List appointments.
 */
export async function listAppointments(
  filters?: AppointmentFilters
): Promise<Appointment[]> {
  let query = supabaseServer
    .from(TABLE)
    .select("*")
    .order("appointment_date")
    .order("appointment_time");

  query = query.eq("clinic_id", filters?.clinicId);

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.appointmentDate) {
    query = query.eq(
      "appointment_date",
      filters.appointmentDate
    );
  }

  if (filters?.patientName) {
    query = query.ilike(
      "patient_name",
      `%${filters.patientName}%`
    );
  }

  if (filters?.phone) {
    query = query.eq(
      "phone",
      filters.phone
    );
  }
  if (filters?.doctorId) query = query.eq("doctor_id", filters.doctorId);
  if (filters?.serviceId) query = query.eq("service_id", filters.serviceId);
  if (filters?.roomId) query = query.eq("room_id", filters.roomId);

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(fromAppointmentPersistence);
}

/**
 * Update appointment.
 */
export async function updateAppointment(
  id: string,
  input: UpdateAppointmentInput,
  scope: ClinicScope,
): Promise<Appointment> {
  const updates: Record<string, unknown> = {};

  if (input.patientName !== undefined)
    updates.patient_name = input.patientName;

  if (input.phone !== undefined)
    updates.phone = input.phone;

  if (input.email !== undefined)
    updates.email = input.email;

  if (input.appointmentDate !== undefined)
    updates.appointment_date =
      input.appointmentDate;

  if (input.appointmentTime !== undefined)
    updates.appointment_time =
      input.appointmentTime;

  if (input.service !== undefined)
    updates.service = input.service;

  if (input.status !== undefined)
    updates.status = input.status;

  if (input.notes !== undefined)
    updates.notes = input.notes;

  if (input.source !== undefined)
    updates.source = input.source;
  if (input.doctorId !== undefined) updates.doctor_id = input.doctorId;
  if (input.serviceId !== undefined) updates.service_id = input.serviceId;
  if (input.roomId !== undefined) updates.room_id = input.roomId;
  if (input.durationMinutes !== undefined) updates.duration_minutes = input.durationMinutes;
  if (input.checkedInAt !== undefined) updates.checked_in_at = input.checkedInAt;
  if (input.completedAt !== undefined) updates.completed_at = input.completedAt;

  const { data, error } = await supabaseServer
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .eq("clinic_id", scope.clinicId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromAppointmentPersistence(data);
}

/**
 * Delete appointment.
 */
export async function deleteAppointment(
  id: string,
  scope: ClinicScope,
): Promise<void> {
  const { error } = await supabaseServer
    .from(TABLE)
    .delete()
    .eq("id", id)
    .eq("clinic_id", scope.clinicId);

  if (error) {
    throw error;
  }
}

