import { supabaseServer } from "@/lib/supabase-server";

import type {
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
  PatientFilters,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Patient Repository
 * ============================================================
 *
 * Data access layer.
 * Only this file communicates with Supabase.
 * ============================================================
 */

const TABLE = "patients";

/**
 * Create patient.
 */
export async function createPatient(
  input: CreatePatientInput
): Promise<Patient> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .insert({
      clinic_name: input.clinicName,
      first_name: input.firstName,
      last_name: input.lastName,
      full_name: `${input.firstName} ${input.lastName}`,
      phone_number: input.phoneNumber,
      email: input.email,
      date_of_birth: input.dateOfBirth,
      preferred_contact_method:
        input.preferredContactMethod,
      preferred_dentist:
        input.preferredDentist,
      notes: input.notes,
      status: "new",
      total_appointments: 0,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapPatient(data);
}

/**
 * Get patient by ID.
 */
export async function getPatient(
  id: string
): Promise<Patient | null> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPatient(data) : null;
}

/**
 * Find patient by phone number.
 */
export async function findPatientByPhone(
  phoneNumber: string
): Promise<Patient | null> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPatient(data) : null;
}

/**
 * List patients.
 */
export async function listPatients(
  filters?: PatientFilters
): Promise<Patient[]> {
  let query = supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (filters?.status) {
    query = query.eq(
      "status",
      filters.status
    );
  }

  if (filters?.clinicName) {
    query = query.eq(
      "clinic_name",
      filters.clinicName
    );
  }

  if (filters?.phoneNumber) {
    query = query.eq(
      "phone_number",
      filters.phoneNumber
    );
  }

  if (filters?.email) {
    query = query.eq(
      "email",
      filters.email
    );
  }

  if (filters?.name) {
    query = query.ilike(
      "full_name",
      `%${filters.name}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapPatient);
}

/**
 * Update patient.
 */
export async function updatePatient(
  id: string,
  input: UpdatePatientInput
): Promise<Patient> {
  const updates: Record<string, unknown> = {};

  if (input.firstName !== undefined)
    updates.first_name = input.firstName;

  if (input.lastName !== undefined)
    updates.last_name = input.lastName;

  if (
    input.firstName !== undefined ||
    input.lastName !== undefined
  ) {
    updates.full_name = [
      input.firstName,
      input.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (input.phoneNumber !== undefined)
    updates.phone_number =
      input.phoneNumber;

  if (input.email !== undefined)
    updates.email = input.email;

  if (input.dateOfBirth !== undefined)
    updates.date_of_birth =
      input.dateOfBirth;

  if (
    input.preferredContactMethod !==
    undefined
  ) {
    updates.preferred_contact_method =
      input.preferredContactMethod;
  }

  if (
    input.preferredDentist !== undefined
  ) {
    updates.preferred_dentist =
      input.preferredDentist;
  }

  if (input.notes !== undefined)
    updates.notes = input.notes;

  if (input.status !== undefined)
    updates.status = input.status;

  if (
    input.totalAppointments !== undefined
  ) {
    updates.total_appointments =
      input.totalAppointments;
  }

  if (
    input.lastAppointmentDate !==
    undefined
  ) {
    updates.last_appointment_date =
      input.lastAppointmentDate;
  }

  if (input.lastCallDate !== undefined) {
    updates.last_call_date =
      input.lastCallDate;
  }

  const { data, error } =
    await supabaseServer
      .from(TABLE)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return mapPatient(data);
}

/**
 * Delete patient.
 */
export async function deletePatient(
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
 * Convert Supabase row
 * into Patient model.
 */
function mapPatient(
  row: any
): Patient {
  return {
    id: row.id,
    clinicName: row.clinic_name,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    email: row.email,
    dateOfBirth: row.date_of_birth,
    preferredContactMethod:
      row.preferred_contact_method,
    preferredDentist:
      row.preferred_dentist,
    notes: row.notes,
    status: row.status,
    totalAppointments:
      row.total_appointments,
    lastAppointmentDate:
      row.last_appointment_date,
    lastCallDate:
      row.last_call_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}