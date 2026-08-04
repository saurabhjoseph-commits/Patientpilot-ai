import {
  findOrCreatePatient,
  incrementAppointmentCount,
} from "./service";

import type { Patient } from "./types";

import type {
  Appointment,
} from "@/lib/appointments/types";

/**
 * ============================================================
 * PatientPilot AI
 * Patient Integration
 * ============================================================
 *
 * Bridges the Appointment module and
 * the Patient CRM.
 * ============================================================
 */

export interface PatientIntegrationResult {
  patient: Patient;

  created: boolean;
}

/**
 * Synchronize a patient from an appointment.
 */
export async function syncPatient(
  appointment: Appointment,
  clinicName: string,
): Promise<PatientIntegrationResult> {
  const names = splitName(
    appointment.patientName
  );

  const patient =
    await findOrCreatePatient({
      clinicName,

      firstName:
        names.firstName,

      lastName:
        names.lastName,

      phoneNumber:
        appointment.phone ?? "",

      preferredDentist: undefined,

      notes:
        appointment.notes ?? undefined,
    });

  const updated =
    await incrementAppointmentCount(
      patient
    );

  return {
    patient: updated,
    created:
      patient.totalAppointments === 0,
  };
}

/**
 * Splits a full name into
 * first and last name.
 */
function splitName(
  fullName: string
): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName
    .trim()
    .split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: "",
    };
  }

  return {
    firstName: parts[0],
    lastName: parts
      .slice(1)
      .join(" "),
  };
}
