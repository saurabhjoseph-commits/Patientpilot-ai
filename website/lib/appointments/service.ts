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
  id: string
): Promise<Appointment | null> {
  return getAppointment(id);
}

/**
 * List appointments.
 */
export async function listAppointmentsService(
  filters?: AppointmentFilters
): Promise<Appointment[]> {
  return listAppointments(filters);
}

/**
 * Update appointment.
 */
export async function updateAppointmentService(
  id: string,
  input: UpdateAppointmentInput
): Promise<Appointment> {
  const validation =
    validateUpdateAppointment(input);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n")
    );
  }

  return updateAppointment(id, input);
}

/**
 * Cancel appointment.
 */
export async function cancelAppointmentService(
  id: string
): Promise<Appointment> {
  return updateAppointment(id, {
    status: "cancelled",
  });
}

/**
 * Confirm appointment.
 */
export async function confirmAppointmentService(
  id: string
): Promise<Appointment> {
  return updateAppointment(id, {
    status: "confirmed",
  });
}

/**
 * Complete appointment.
 */
export async function completeAppointmentService(
  id: string
): Promise<Appointment> {
  return updateAppointment(id, {
    status: "completed",
  });
}

/**
 * Reschedule appointment.
 */
export async function rescheduleAppointmentService(
  id: string,
  appointmentDate: string,
  appointmentTime: string
): Promise<Appointment> {
  return updateAppointment(id, {
    appointmentDate,
    appointmentTime,
    status: "rescheduled",
  });
}

/**
 * Delete appointment.
 */
export async function deleteAppointmentService(
  id: string
): Promise<void> {
  return deleteAppointment(id);
}