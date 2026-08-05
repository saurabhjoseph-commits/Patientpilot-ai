/**
 * ============================================================
 * PatientPilot AI
 * Appointment Validator
 * ============================================================
 */

import {
  Appointment,
  AppointmentStatus,
} from "./appointment.types";

export interface ValidationResult {
  valid: boolean;

  errors: string[];
}

export function validateAppointment(
  appointment: Appointment,
): ValidationResult {
  const errors: string[] = [];

  if (!appointment.id.trim()) {
    errors.push(
      "Appointment ID is required.",
    );
  }

  if (!appointment.tenantId.trim()) {
    errors.push(
      "Tenant ID is required.",
    );
  }

  validatePatient(
    appointment,
    errors,
  );

  validateProvider(
    appointment,
    errors,
  );

  validateLocation(
    appointment,
    errors,
  );

  validateSchedule(
    appointment,
    errors,
  );

  validateReminder(
    appointment,
    errors,
  );

  validateStatus(
    appointment.status,
    appointment,
    errors,
  );

  if (!appointment.reason.trim()) {
    errors.push(
      "Appointment reason is required.",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validatePatient(
  appointment: Appointment,
  errors: string[],
): void {
  const patient =
    appointment.patient;

  if (
    !patient.customerId.trim()
  ) {
    errors.push(
      "Customer ID is required.",
    );
  }

  if (
    !patient.firstName.trim()
  ) {
    errors.push(
      "Patient first name is required.",
    );
  }

  if (
    !patient.lastName.trim()
  ) {
    errors.push(
      "Patient last name is required.",
    );
  }
}

function validateProvider(
  appointment: Appointment,
  errors: string[],
): void {
  const provider =
    appointment.provider;

  if (
    !provider.providerId.trim()
  ) {
    errors.push(
      "Provider ID is required.",
    );
  }

  if (
    !provider.providerName.trim()
  ) {
    errors.push(
      "Provider name is required.",
    );
  }
}

function validateLocation(
  appointment: Appointment,
  errors: string[],
): void {
  if (
    !appointment.location.clinicId.trim()
  ) {
    errors.push(
      "Clinic ID is required.",
    );
  }
}

function validateSchedule(
  appointment: Appointment,
  errors: string[],
): void {
  const schedule =
    appointment.schedule;

  if (
    schedule.startTime >=
    schedule.endTime
  ) {
    errors.push(
      "Appointment start time must be before end time.",
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
      (schedule.endTime.getTime() -
        schedule.startTime.getTime()) /
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

function validateReminder(
  appointment: Appointment,
  errors: string[],
): void {
  const reminder =
    appointment.reminder;

  if (
    reminder.reminderSent &&
    !reminder.lastReminderAt
  ) {
    errors.push(
      "Reminder timestamp is required when a reminder has been sent.",
    );
  }
}

function validateStatus(
  status: AppointmentStatus,
  appointment: Appointment,
  errors: string[],
): void {
  switch (status) {
    case "completed":
      if (
        appointment.schedule.endTime >
        new Date()
      ) {
        errors.push(
          "Future appointments cannot be completed.",
        );
      }
      break;

    case "checked_in":
    case "in_progress":
      if (
        appointment.schedule.startTime >
        new Date()
      ) {
        errors.push(
          "Appointment cannot be checked in before its scheduled start time.",
        );
      }
      break;
  }
}