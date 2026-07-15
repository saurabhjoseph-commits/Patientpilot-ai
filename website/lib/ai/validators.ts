// website/lib/ai/validators.ts

import type {
  AIResponse,
  AppointmentData,
  ConversationAnalysis,
  ValidationResult,
  AIAction,
} from "./core";

/**
 * ============================================================
 * PatientPilot AI
 * Domain Validators
 * ============================================================
 *
 * Pure validation.
 * No normalization.
 * No mutation.
 * No OpenAI.
 * ============================================================
 */

function ok(): ValidationResult {
  return {
    valid: true,
    score: 100,
    errors: [],
    missingFields: [],
  };
}

function fail(
  errors: string[],
  missingFields: string[] = [],
): ValidationResult {
  return {
    valid: false,
    score: Math.max(
      0,
      100 - missingFields.length * 20,
    ),
    errors,
    missingFields,
  };
}

/* ============================================================
 * Appointment Validation
 * ============================================================
 */

export function validateAppointment(
  appointment?: Partial<AppointmentData>,
): ValidationResult {

  if (!appointment) {
    return ok();
  }

  const errors: string[] = [];
  const missing: string[] = [];

  const required = [
    ["patientName", appointment.patientName],
    ["phoneNumber", appointment.phoneNumber],
    [
      "reason",
      appointment.reason ??
        appointment.procedure,
    ],
    [
      "preferredDate",
      appointment.preferredDate ??
        appointment.appointmentDate,
    ],
    [
      "preferredTime",
      appointment.preferredTime ??
        appointment.appointmentTime,
    ],
  ] as const;

  for (const [field, value] of required) {

    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      missing.push(field);
    }
  }

  if (
    appointment.confirmed &&
    missing.length > 0
  ) {
    errors.push(
      "Confirmed appointment is missing required information.",
    );
  }

  return errors.length
    ? fail(errors, missing)
    : ok();
}

/* ============================================================
 * Conversation Analysis
 * ============================================================
 */

export function validateAnalysis(
  analysis: ConversationAnalysis,
): ValidationResult {

  const errors: string[] = [];

  if (!analysis.intent) {
    errors.push("Intent is required.");
  }

  if (!analysis.nextState) {
    errors.push(
      "Next state is required.",
    );
  }

  if (
    analysis.confidence < 0 ||
    analysis.confidence > 100
  ) {
    errors.push(
      "Confidence must be between 0 and 100.",
    );
  }

  return errors.length
    ? fail(errors)
    : ok();
}

/* ============================================================
 * AI Actions
 * ============================================================
 */

export function validateActions(
  response: AIResponse,
): ValidationResult {

  const errors: string[] = [];

  const actions =
    response.actions as AIAction[];

  if (
    actions.includes(
      "BOOK_APPOINTMENT" as AIAction,
    ) &&
    !response.appointment?.confirmed
  ) {
    errors.push(
      "Cannot book an unconfirmed appointment.",
    );
  }

  return errors.length
    ? fail(errors)
    : ok();
}

/* ============================================================
 * AI Response
 * ============================================================
 */

export function validateAIResponse(
  response: AIResponse,
): ValidationResult {

  const errors: string[] = [];
  const missingFields: string[] = [];

  const analysis =
    validateAnalysis(
      response.analysis,
    );

  errors.push(...analysis.errors);

  missingFields.push(
    ...analysis.missingFields,
  );

  const appointment =
    validateAppointment(
      response.appointment,
    );

  errors.push(...appointment.errors);

  missingFields.push(
    ...appointment.missingFields,
  );

  const actions =
    validateActions(response);

  errors.push(...actions.errors);

  if (!response.message.trim()) {
    errors.push(
      "Message cannot be empty.",
    );
  }

  if (!response.speech.trim()) {
    errors.push(
      "Speech cannot be empty.",
    );
  }

  return errors.length
    ? fail(errors, missingFields)
    : ok();
}