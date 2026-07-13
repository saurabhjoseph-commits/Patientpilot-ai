import { supabaseServer } from "@/lib/supabase-server";

import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
} from "./types";

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
    .insert({
      clinic_name: input.clinicName,
      patient_name: input.patientName,
      phone_number: input.phoneNumber,
      appointment_date: input.appointmentDate,
      appointment_time: input.appointmentTime,
      reason: input.reason,
      status: "pending",
      call_sid: input.callSid,
      lead_id: input.leadId,
      notes: input.notes,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapAppointment(data);
}

/**
 * Get appointment by ID.
 */
export async function getAppointment(
  id: string
): Promise<Appointment | null> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapAppointment(data) : null;
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

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.clinicName) {
    query = query.eq(
      "clinic_name",
      filters.clinicName
    );
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

  if (filters?.phoneNumber) {
    query = query.eq(
      "phone_number",
      filters.phoneNumber
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapAppointment);
}

/**
 * Update appointment.
 */
export async function updateAppointment(
  id: string,
  input: UpdateAppointmentInput
): Promise<Appointment> {
  const updates: Record<string, unknown> = {};

  if (input.patientName !== undefined)
    updates.patient_name = input.patientName;

  if (input.phoneNumber !== undefined)
    updates.phone_number = input.phoneNumber;

  if (input.appointmentDate !== undefined)
    updates.appointment_date =
      input.appointmentDate;

  if (input.appointmentTime !== undefined)
    updates.appointment_time =
      input.appointmentTime;

  if (input.reason !== undefined)
    updates.reason = input.reason;

  if (input.status !== undefined)
    updates.status = input.status;

  if (input.notes !== undefined)
    updates.notes = input.notes;

  if (input.leadId !== undefined)
    updates.lead_id = input.leadId;

  const { data, error } = await supabaseServer
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapAppointment(data);
}

/**
 * Delete appointment.
 */
export async function deleteAppointment(
  id: string
): Promise<void> {
  const { error } = await supabaseServer
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

/**
 * Maps Supabase row into Appointment.
 */
function mapAppointment(row: any): Appointment {
  return {
    id: row.id,
    clinicName: row.clinic_name,
    patientName: row.patient_name,
    phoneNumber: row.phone_number,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    reason: row.reason,
    status: row.status,
    callSid: row.call_sid,
    leadId: row.lead_id,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}