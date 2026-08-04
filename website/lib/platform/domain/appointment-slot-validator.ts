/**
 * ============================================================
 * PatientPilot AI
 * Appointment Slot Validator
 * ============================================================
 */

import {
  AppointmentSlot,
  AppointmentSlotStatus,
} from "./appointment-slot.types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAppointmentSlot(
  slot: AppointmentSlot,
): ValidationResult {
  const errors: string[] = [];

  validateIdentity(slot, errors);
  validateProvider(slot, errors);
  validateSchedule(slot, errors);
  validateReservation(slot, errors);
  validateStatus(slot, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateIdentity(
  slot: AppointmentSlot,
  errors: string[],
): void {
  if (!slot.id.trim()) {
    errors.push(
      "Slot ID is required.",
    );
  }

  if (!slot.tenantId.trim()) {
    errors.push(
      "Tenant ID is required.",
    );
  }
}

function validateProvider(
  slot: AppointmentSlot,
  errors: string[],
): void {
  if (!slot.provider.providerId.trim()) {
    errors.push(
      "Provider ID is required.",
    );
  }

  if (!slot.provider.clinicId.trim()) {
    errors.push(
      "Clinic ID is required.",
    );
  }
}

function validateSchedule(
  slot: AppointmentSlot,
  errors: string[],
): void {
  const schedule = slot.schedule;

  if (
    schedule.startsAt >= schedule.endsAt
  ) {
    errors.push(
      "Slot start time must be before end time.",
    );
  }

  if (
    schedule.durationMinutes <= 0
  ) {
    errors.push(
      "Duration must be greater than zero.",
    );
  }

  const calculatedDuration =
    Math.round(
      (schedule.endsAt.getTime() -
        schedule.startsAt.getTime()) /
        60000,
    );

  if (
    calculatedDuration !==
    schedule.durationMinutes
  ) {
    errors.push(
      "Duration does not match the scheduled time.",
    );
  }

  if (
    !schedule.timezone.trim()
  ) {
    errors.push(
      "Timezone is required.",
    );
  }
}

function validateReservation(
  slot: AppointmentSlot,
  errors: string[],
): void {
  const reservation =
    slot.reservation;

  if (
    reservation.reservedUntil &&
    !reservation.customerId
  ) {
    errors.push(
      "Reserved slot must have a customer.",
    );
  }

  if (
    reservation.appointmentId &&
    !reservation.customerId
  ) {
    errors.push(
      "Booked appointment must have a customer.",
    );
  }
}

function validateStatus(
  slot: AppointmentSlot,
  errors: string[],
): void {
  const status =
    slot.status;

  const reservation =
    slot.reservation;

  switch (status) {
    case "available":
      if (
        reservation.customerId ||
        reservation.appointmentId
      ) {
        errors.push(
          "Available slot cannot contain a reservation.",
        );
      }
      break;

    case "reserved":
      if (
        !reservation.customerId
      ) {
        errors.push(
          "Reserved slot requires a customer.",
        );
      }

      if (
        !reservation.reservedUntil
      ) {
        errors.push(
          "Reserved slot requires an expiration time.",
        );
      }
      break;

    case "booked":
      if (
        !reservation.appointmentId
      ) {
        errors.push(
          "Booked slot requires an appointment.",
        );
      }
      break;

    case "blocked":
    case "unavailable":
      break;

    default:
      assertNever(
        status,
      );
  }
}

function assertNever(
  value: never,
): never {
  throw new Error(
    `Unhandled slot status: ${value}`,
  );
}