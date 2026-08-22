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
import { resolveClinicalLinkage } from "./clinical-linkage";
import { checkAuthoritativeSlot } from "@/lib/scheduling/availability-service";

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

  const linkage = await resolveClinicalLinkage(input);
  await assertAvailable({ ...input, ...linkage });
  return createAppointment({ ...input, ...linkage });
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

  const current = await getAppointment(id, scope);
  if (!current) throw new Error("Appointment not found.");
  const linkageChanged = input.doctorId !== undefined || input.serviceId !== undefined || input.roomId !== undefined || input.durationMinutes !== undefined;
  if (!linkageChanged && input.appointmentDate === undefined && input.appointmentTime === undefined) return updateAppointment(id, input, scope);
  const linkage = await resolveClinicalLinkage({
    clinicId: scope.clinicId,
    patientName: current.patientName,
    phone: current.phone ?? "",
    service: input.service ?? current.service,
    appointmentDate: input.appointmentDate ?? current.appointmentDate,
    appointmentTime: input.appointmentTime ?? current.appointmentTime,
    doctorId: input.doctorId ?? current.doctorId ?? undefined,
    serviceId: input.serviceId ?? current.serviceId ?? undefined,
    roomId: input.roomId ?? current.roomId ?? undefined,
    durationMinutes: input.durationMinutes ?? current.durationMinutes ?? undefined,
  });
  const candidate = { ...current, ...input, ...linkage, clinicId: scope.clinicId };
  await assertAvailable({ clinicId: scope.clinicId, patientName: candidate.patientName, phone: candidate.phone ?? "", service: candidate.service, appointmentDate: candidate.appointmentDate, appointmentTime: candidate.appointmentTime, doctorId: candidate.doctorId ?? undefined, serviceId: candidate.serviceId ?? undefined, roomId: candidate.roomId ?? undefined, durationMinutes: candidate.durationMinutes ?? undefined }, id);
  return updateAppointment(id, { ...input, ...linkage }, scope);
}

/**
 * Cancel appointment.
 */
export async function cancelAppointmentService(
  id: string,
  scope: ClinicScope,
): Promise<Appointment> {
  const current = await getAppointment(id, scope);
  if (!current) throw new Error("Appointment not found.");
  if (current.status === "Cancelled" || current.completedAt || current.status === "Completed") throw new Error("This appointment cannot be cancelled.");
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
  const current = await getAppointment(id, scope);
  if (!current) throw new Error("Appointment not found.");
  if (current.status === "Confirmed" || current.checkedInAt || current.completedAt || current.status === "Cancelled" || current.status === "Completed") throw new Error("This appointment cannot be confirmed.");
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
  const current = await getAppointment(id, scope);
  if (!current) throw new Error("Appointment not found.");
  if (!current.checkedInAt) throw new Error("An appointment must be checked in before it can be completed.");
  if (current.completedAt || current.status === "Cancelled") throw new Error("This appointment cannot be completed.");
  return updateAppointment(id, { status: "Completed", completedAt: new Date().toISOString() }, scope);
}

export async function checkInAppointmentService(id: string, scope: ClinicScope): Promise<Appointment> { const current = await getAppointment(id, scope); if (!current) throw new Error("Appointment not found."); if (current.checkedInAt || current.completedAt || current.status === "Cancelled") throw new Error("This appointment cannot be checked in."); return updateAppointment(id, { status: "Checked In", checkedInAt: new Date().toISOString() }, scope); }

/**
 * Reschedule appointment.
 */
export async function rescheduleAppointmentService(
  id: string,
  appointmentDate: string,
  appointmentTime: string,
  scope: ClinicScope,
): Promise<Appointment> {
  return updateAppointmentService(id, { appointmentDate, appointmentTime, status: "Rescheduled" }, scope);
}

async function assertAvailable(input: CreateAppointmentInput, excludeAppointmentId?: string): Promise<void> {
  // Legacy appointments without H2.5 clinical linkage remain supported; new linked
  // appointments always flow through the authoritative availability authority.
  if (!input.serviceId || !input.doctorId || !input.roomId || !input.durationMinutes) return;
  const result = await checkAuthoritativeSlot({ clinicId: input.clinicId, serviceId: input.serviceId, doctorId: input.doctorId, date: input.appointmentDate, startTime: input.appointmentTime, durationMinutes: input.durationMinutes, excludeAppointmentId });
  if (!result.available) throw new Error(`Requested appointment slot is unavailable: ${result.reason}.`);
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
