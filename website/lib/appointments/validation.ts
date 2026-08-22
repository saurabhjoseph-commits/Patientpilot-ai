import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Appointment Validation
 * ============================================================
 */

export interface ValidationResult {
  valid: boolean;

  score: number;

  errors: string[];
}

const US_PHONE_REGEX =
  /^(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/;
const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

const NATIVE_TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const MERIDIEM_TIME_REGEX = /^(?:0?[1-9]|1[0-2])(?::[0-5]\d)?\s?(AM|PM)$/i;

/**
 * ============================================================
 * Patient Name
 * ============================================================
 */

export function validatePatientName(
  name: string
): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("Patient name is required.");
  } else if (name.trim().length < 2) {
    errors.push("Patient name is too short.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Phone Number
 * ============================================================
 */

export function validatePhoneNumber(
  phone: string
): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push("Phone number is required.");
  } else if (!US_PHONE_REGEX.test(phone.trim()) && !E164_PHONE_REGEX.test(phone.trim())) {
    errors.push("Invalid phone number.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Appointment Date
 * ============================================================
 */

export function validateAppointmentDate(
  date: string
): ValidationResult {
  const errors: string[] = [];

  if (!date || date.trim().length === 0) {
    errors.push("Appointment date is required.");
  } else if (!isCalendarDate(date.trim())) {
    errors.push("Invalid appointment date.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Appointment Time
 * ============================================================
 */

export function validateAppointmentTime(
  time: string
): ValidationResult {
  const errors: string[] = [];

  if (!time) {
    errors.push("Appointment time is required.");
  } else if (!NATIVE_TIME_REGEX.test(time.trim()) && !MERIDIEM_TIME_REGEX.test(time.trim())) {
    errors.push("Invalid appointment time.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/**
 * ============================================================
 * Appointment Reason
 * ============================================================
 */

export function validateService(
  service: string
): ValidationResult {
  const errors: string[] = [];

  if (!service || service.trim().length < 3) {
    errors.push("Appointment service is required.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Create Appointment
 * ============================================================
 */

export function validateCreateAppointment(
  appointment: CreateAppointmentInput
): ValidationResult {
  const validations = [
    {
      valid: appointment.clinicId.length > 0,
      score: appointment.clinicId.length > 0 ? 100 : 0,
      errors: appointment.clinicId.length > 0 ? [] : ["Trusted clinic scope is required."],
    },
    validatePatientName(
      appointment.patientName
    ),
    validatePhoneNumber(
      appointment.phone
    ),
    validateAppointmentDate(
      appointment.appointmentDate
    ),
    validateAppointmentTime(
      appointment.appointmentTime
    ),
    validateService(
      appointment.service
    ),
  ];

  const errors = validations.flatMap(
    (result) => result.errors
  );

  const passed =
    validations.filter(
      (result) => result.valid
    ).length;

  return {
    valid: errors.length === 0,
    score: Math.round(
      (passed / validations.length) * 100
    ),
    errors,
  };
}

/**
 * ============================================================
 * Update Appointment
 * ============================================================
 */

export function validateUpdateAppointment(
  appointment: UpdateAppointmentInput
): ValidationResult {
  const errors: string[] = [];

  if (
    appointment.patientName !== undefined
  ) {
    errors.push(
      ...validatePatientName(
        appointment.patientName
      ).errors
    );
  }

  if (
    appointment.phone !== undefined
  ) {
    errors.push(
      ...validatePhoneNumber(
        appointment.phone
      ).errors
    );
  }

  if (
    appointment.appointmentDate !== undefined
  ) {
    errors.push(
      ...validateAppointmentDate(
        appointment.appointmentDate
      ).errors
    );
  }

  if (
    appointment.appointmentTime !== undefined
  ) {
    errors.push(
      ...validateAppointmentTime(
        appointment.appointmentTime
      ).errors
    );
  }

  if (
    appointment.service !== undefined
  ) {
    errors.push(
      ...validateService(
        appointment.service
      ).errors
    );
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Existing Appointment
 * ============================================================
 */

export function validateAppointment(
  appointment: Appointment
): ValidationResult {
  return validateCreateAppointment({
    clinicId:
      appointment.clinicId,
    patientName:
      appointment.patientName,
    phone:
      appointment.phone ?? "",
    appointmentDate:
      appointment.appointmentDate,
    appointmentTime:
      appointment.appointmentTime,
    service:
      appointment.service,
    email:
      appointment.email ?? undefined,
    source:
      appointment.source,
    notes:
      appointment.notes ?? undefined,
  });
}
