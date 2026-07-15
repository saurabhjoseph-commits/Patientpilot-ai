// website/lib/ai/execution/validators.ts

import type {
  AIResponse,
  AppointmentData,
  ValidationResult,
} from "../core";

/**
 * ============================================================
 * PatientPilot AI
 * RC5 Execution Engine
 * Business Validators
 * ============================================================
 *
 * These validators enforce business rules.
 * They DO NOT parse JSON.
 * They DO NOT call OpenAI.
 */

/**
 * Required fields before an appointment
 * may be booked.
 */
const REQUIRED_APPOINTMENT_FIELDS = [
  "patientName",
  "procedure",
  "preferredDate",
  "preferredTime",
] as const;

/**
 * Validate appointment information.
 */
export function validateAppointment(
  appointment?: AppointmentData,
): ValidationResult {

  if (!appointment) {
    return {
      valid: false,

      score: 0,

      errors: [
        "Appointment data is missing.",
      ],

      missingFields: [
        ...REQUIRED_APPOINTMENT_FIELDS,
      ],
    };
  }

  const missingFields: string[] = [];

  for (const field of REQUIRED_APPOINTMENT_FIELDS) {
    const value = appointment[field];

    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      missingFields.push(field);
    }
  }

  const totalFields =
  REQUIRED_APPOINTMENT_FIELDS.length;

const score =
  (totalFields - missingFields.length) /
  totalFields;

  return {
    valid:
      missingFields.length === 0,

    score,

    errors:
      missingFields.map(
        field =>
          `${field} is required.`,
      ),

    missingFields,
  };
}

/**
 * Determine whether the AI
 * has enough information to
 * create an appointment.
 */
export function canBookAppointment(
  appointment?: AppointmentData,
): boolean {

  const validation =
    validateAppointment(
      appointment,
    );

  return (
    validation.valid &&
    appointment?.confirmed === true
  );
}

/**
 * Detect emergency situations.
 */
export function isEmergency(
  response: AIResponse,
): boolean {

  return (
    response.intent ===
      "emergency" ||

    response.analysis.needsHuman
  );
}

/**
 * Detect whether a human
 * handoff is required.
 */
export function requiresHuman(
  response: AIResponse,
): boolean {

  return (
    response.analysis.needsHuman ||
    response.intent ===
      "human_agent"
  );
}

/**
 * Ensure confidence
 * exceeds the minimum threshold.
 */
export function hasConfidence(
  response: AIResponse,
  minimum = 0.7,
): boolean {

  return (
    response.confidence >= minimum
  );
}

/**
 * Validate the entire AI response.
 */
export function validateResponse(
  response: AIResponse,
): ValidationResult {

  const appointmentValidation =
    validateAppointment(
      response.appointment,
    );

  const errors = [
    ...appointmentValidation.errors,
  ];

  if (!response.message.trim()) {
    errors.push(
      "Response message is empty.",
    );
  }

  if (!response.speech.trim()) {
    errors.push(
      "Speech output is empty.",
    );
  }

  return {
    valid:
      errors.length === 0,

    score:
      appointmentValidation.score,

    errors,

    missingFields:
      appointmentValidation.missingFields,
  };
}