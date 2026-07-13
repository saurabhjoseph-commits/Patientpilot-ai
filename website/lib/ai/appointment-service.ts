import type {
  AppointmentData,
} from "./types";

import {
  mergeAppointmentData,
} from "./extractor";

import {
  validateAppointment,
} from "./validator";

import {
  getMissingAppointmentFields,
} from "./conversation";

/**
 * ============================================================
 * PatientPilot AI
 * Appointment Service
 * ============================================================
 */

export interface AppointmentStatus {
  complete: boolean;

  missingFields: string[];

  validationScore: number;

  valid: boolean;
}

/**
 * Merge newly extracted data into
 * an existing appointment.
 */
export function updateAppointment(
  current: Partial<AppointmentData>,
  extracted: Partial<AppointmentData>
): AppointmentData {
  return mergeAppointmentData(
    current,
    extracted
  );
}

/**
 * Returns appointment status.
 */
export function getAppointmentStatus(
  appointment: Partial<AppointmentData>
): AppointmentStatus {
  const validation =
    validateAppointment(appointment);

  return {
    complete:
      validation.valid,

    missingFields:
      getMissingAppointmentFields(
        appointment
      ),

    validationScore:
      validation.score,

    valid:
      validation.valid,
  };
}

/**
 * Returns true when the appointment
 * is ready to be booked.
 */
export function canBookAppointment(
  appointment: Partial<AppointmentData>
): boolean {
  return getAppointmentStatus(
    appointment
  ).complete;
}

/**
 * Returns a readable appointment summary.
 */
export function buildAppointmentSummary(
  appointment: Partial<AppointmentData>
): string {
  return [
    `Patient: ${appointment.patientName ?? "Unknown"}`,
    `Phone: ${appointment.phoneNumber ?? "Unknown"}`,
    `Reason: ${appointment.reason ?? "Unknown"}`,
    `Date: ${appointment.appointmentDate ?? "Unknown"}`,
    `Time: ${appointment.appointmentTime ?? "Unknown"}`,
  ].join("\n");
}