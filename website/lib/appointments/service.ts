import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
} from "./repository";

import {
  validateCreateAppointment,
  validateUpdateAppointment,
} from "./validation";

import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./types";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";

/**
 * ============================================================
 * PatientPilot AI
 * Appointment Service
 * ============================================================
 *
 * Business layer for appointments.
 * This module performs validation and delegates
 * persistence to the repository.
 * ============================================================
 */

/**
 * Create appointment.
 */
export async function createAppointmentService(
  input: CreateAppointmentInput
): Promise<Appointment> {
  const validation =
    validateCreateAppointment(input);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n")
    );
  }

  return createAppointment(input);
}

/**
 * Get appointment.
 */
export async function getAppointmentService(
  id: string,
  scope: ClinicScope,
): Promise<Appointment | null> {
  return getAppointment(id, scope);
}

/**
 * List appointments.
 */
export async function listAppointmentsService(
  filters: AppointmentFilters,
): Promise<Appointment[]> {
  return listAppointments(filters);
}

/**
 * Update appointment.
 */
export async function updateAppointmentService(
  id: string,
  input: UpdateAppointmentInput,
  scope: ClinicScope,
): Promise<Appointment> {
  const validation =
    validateUpdateAppointment(input);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n")
    );
  }

  return updateAppointment(id, input, scope);
}

/**
 * Cancel appointment.
 */
export async function cancelAppointmentService(
  id: string,
  scope: ClinicScope,
): Promise<Appointment> {
  return updateAppointment(id, {
    status: "Cancelled",
  }, scope);
}

/**
 * Confirm appointment.
 */
export async function confirmAppointmentService(
  id: string,
  scope: ClinicScope,
): Promise<Appointment> {
  return updateAppointment(id, {
    status: "Confirmed",
  }, scope);
}

/**
 * Complete appointment.
 */
export async function completeAppointmentService(
  id: string,
  scope: ClinicScope,
): Promise<Appointment> {
  return updateAppointment(id, {
    status: "Completed",
  }, scope);
}

/**
 * Reschedule appointment.
 */
export async function rescheduleAppointmentService(
  id: string,
  appointmentDate: string,
  appointmentTime: string,
  scope: ClinicScope,
): Promise<Appointment> {
  return updateAppointment(id, {
    appointmentDate,
    appointmentTime,
    status: "Rescheduled",
  }, scope);
}

/**
 * Delete appointment.
 */
export async function deleteAppointmentService(
  id: string,
  scope: ClinicScope,
): Promise<void> {
  return deleteAppointment(id, scope);
}
