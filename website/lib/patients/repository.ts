import { supabaseServer } from "@/lib/supabase-server";

import type {
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
  PatientFilters,
} from "./types";
import {
  fromPatientPersistence,
  toPatientCreatePersistence,
  toPatientUpdatePersistence,
} from "./mapper";

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
    .insert(toPatientCreatePersistence(input))
    .select()
    .single();

  if (error) {
    throw error;
  }

  return fromPatientPersistence(data);
}

/**
 * Get patient by ID.
 */
export async function getPatient(
  id: string,
  clinicId: string,
): Promise<Patient | null> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .eq("clinic_id", clinicId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? fromPatientPersistence(data) : null;
}

/**
 * Find patient by phone number.
 */
export async function findPatientByPhone(
  clinicId: string,
  phoneNumber: string,
): Promise<Patient | null> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .eq("clinic_id", clinicId)
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? fromPatientPersistence(data) : null;
}

/**
 * List patients.
 */
export async function listPatients(
  filters: PatientFilters
): Promise<Patient[]> {
  let query = supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  query = query.eq("clinic_id", filters.clinicId);

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

  return (data ?? []).map(fromPatientPersistence);
}

/**
 * Update patient.
 */
export async function updatePatient(
  id: string,
  clinicId: string,
  input: UpdatePatientInput
): Promise<Patient> {
  const { data, error } =
    await supabaseServer
      .from(TABLE)
      .update(toPatientUpdatePersistence(input))
      .eq("id", id)
      .eq("clinic_id", clinicId)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return fromPatientPersistence(data);
}

/**
 * Delete patient.
 */
export async function deletePatient(
  id: string,
  clinicId: string,
): Promise<void> {
  const { error } = await supabaseServer
    .from(TABLE)
    .delete()
    .eq("id", id)
    .eq("clinic_id", clinicId);

  if (error) {
    throw error;
  }
}

