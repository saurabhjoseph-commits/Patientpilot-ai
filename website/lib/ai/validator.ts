import type { AppointmentData } from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Validation Engine
 * ============================================================
 */

export interface ValidationResult {
  valid: boolean;
  score: number;
  errors: string[];
}

const PHONE_REGEX =
  /^(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}$/;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const TIME_REGEX =
  /^\d{1,2}(?::\d{2})?\s?(AM|PM)$/i;

/**
 * ============================================================
 * Name Validation
 * ============================================================
 */

export function validateName(
  name?: string
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
 * Phone Validation
 * ============================================================
 */

export function validatePhone(
  phone?: string
): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push("Phone number is required.");
  } else if (!PHONE_REGEX.test(phone.trim())) {
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
 * Email Validation
 * ============================================================
 */

export function validateEmail(
  email?: string
): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    return {
      valid: true,
      score: 100,
      errors: [],
    };
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Invalid email address.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Date Validation
 * ============================================================
 */

export function validateDate(
  date?: string
): ValidationResult {
  const errors: string[] = [];

  if (!date) {
    errors.push("Appointment date is required.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Time Validation
 * ============================================================
 */

export function validateTime(
  time?: string
): ValidationResult {
  const errors: string[] = [];

  if (!time) {
    errors.push("Appointment time is required.");
  } else if (!TIME_REGEX.test(time.trim())) {
    errors.push("Invalid appointment time.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Appointment Reason
 * ============================================================
 */

export function validateReason(
  reason?: string
): ValidationResult {
  const errors: string[] = [];

  if (!reason || reason.trim().length < 3) {
    errors.push("Appointment reason is required.");
  }

  return {
    valid: errors.length === 0,
    score: errors.length === 0 ? 100 : 0,
    errors,
  };
}

/**
 * ============================================================
 * Full Appointment Validation
 * ============================================================
 */

export function validateAppointment(
  appointment: Partial<AppointmentData>
): ValidationResult {
  const errors: string[] = [];

  const validations = [
    validateName(appointment.patientName),
    validatePhone(appointment.phoneNumber),
    validateDate(appointment.appointmentDate),
    validateTime(appointment.appointmentTime),
    validateReason(appointment.reason),
  ];

  validations.forEach((result) => {
    errors.push(...result.errors);
  });

  const passed =
    validations.filter((v) => v.valid).length;

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
 * Appointment Completeness
 * ============================================================
 */

export function isAppointmentComplete(
  appointment: Partial<AppointmentData>
): boolean {
  return validateAppointment(
    appointment
  ).valid;
}