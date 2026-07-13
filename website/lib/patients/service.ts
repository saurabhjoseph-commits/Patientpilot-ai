import {
  createPatient,
  deletePatient,
  findPatientByPhone,
  getPatient,
  listPatients,
  updatePatient,
} from "./repository";

import {
  validateCreatePatient,
  validateUpdatePatient,
} from "./validation";

import type {
  CreatePatientInput,
  Patient,
  PatientFilters,
  UpdatePatientInput,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Patient Service
 * ============================================================
 *
 * Business logic layer.
 * ============================================================
 */

/**
 * Create a patient.
 */
export async function createPatientService(
  input: CreatePatientInput
): Promise<Patient> {
  const validation =
    validateCreatePatient(input);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n")
    );
  }

  return createPatient(input);
}

/**
 * Get patient.
 */
export async function getPatientService(
  id: string
): Promise<Patient | null> {
  return getPatient(id);
}

/**
 * List patients.
 */
export async function listPatientsService(
  filters?: PatientFilters
): Promise<Patient[]> {
  return listPatients(filters);
}

/**
 * Update patient.
 */
export async function updatePatientService(
  id: string,
  input: UpdatePatientInput
): Promise<Patient> {
  const validation =
    validateUpdatePatient(input);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n")
    );
  }

  return updatePatient(id, input);
}

/**
 * Delete patient.
 */
export async function deletePatientService(
  id: string
): Promise<void> {
  return deletePatient(id);
}

/**
 * Find patient by phone.
 */
export async function findPatientByPhoneService(
  phoneNumber: string
): Promise<Patient | null> {
  return findPatientByPhone(phoneNumber);
}

/**
 * Find an existing patient or create a new one.
 */
export async function findOrCreatePatient(
  input: CreatePatientInput
): Promise<Patient> {
  const existing =
    await findPatientByPhone(
      input.phoneNumber
    );

  if (existing) {
    return updatePatient(
      existing.id,
      {
        lastCallDate:
          new Date().toISOString(),
        status: "active",
      }
    );
  }

  return createPatientService(input);
}

/**
 * Increment appointment count.
 */
export async function incrementAppointmentCount(
  patient: Patient
): Promise<Patient> {
  return updatePatient(
    patient.id,
    {
      totalAppointments:
        patient.totalAppointments + 1,

      lastAppointmentDate:
        new Date().toISOString(),

      status: "active",
    }
  );
}