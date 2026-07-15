// website/lib/ai/appointment.ts

import {
  AIAction,
  type AIResponse,
  type AppointmentRequest,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Appointment Business Logic
 * ============================================================
 */

export interface AppointmentEvaluation {
  canBook: boolean;
  missingFields: string[];
  actions: AIAction[];
}

export interface CRMAppointmentRecord {
  patientName: string;
  procedure: string;
  dentist: string | null;
  preferredDate: string;
  preferredTime: string;
  insurance: string | null;
  confirmed: boolean;
  createdAt: string;
}

function hasValue(value?: string): boolean {
  return Boolean(value?.trim());
}

/**
 * Returns true when enough information exists
 * to create an appointment.
 */
export function evaluateAppointment(
  appointment?: AppointmentRequest,
): AppointmentEvaluation {
  if (!appointment) {
    return {
      canBook: false,
      missingFields: ["appointment"],
      actions: [AIAction.NONE],
    };
  }

  const missingFields: string[] = [];

  if (!hasValue(appointment.patientName)) {
    missingFields.push("patientName");
  }

  if (!hasValue(appointment.procedure)) {
    missingFields.push("procedure");
  }

  if (!hasValue(appointment.preferredDate)) {
    missingFields.push("preferredDate");
  }

  if (!hasValue(appointment.preferredTime)) {
    missingFields.push("preferredTime");
  }

  /**
   * Appointment can only be booked when:
   * 1. All required fields are present.
   * 2. The patient has confirmed.
   */
  const canBook =
    missingFields.length === 0 &&
    (appointment.confirmed ?? false);

  const actions: AIAction[] = [];

  if (canBook) {
    actions.push(
      AIAction.BOOK_APPOINTMENT,
      AIAction.SEND_SMS_CONFIRMATION,
      AIAction.SEND_EMAIL_CONFIRMATION,
    );
  } else {
    actions.push(AIAction.NONE);
  }

  return {
    canBook,
    missingFields,
    actions,
  };
}

/**
 * Convert an appointment into a database-ready object.
 */
export function toCRMAppointment(
  appointment: AppointmentRequest,
): CRMAppointmentRecord {
  return {
    patientName: appointment.patientName ?? "",
    procedure: appointment.procedure ?? "",
    dentist: appointment.dentist ?? null,
    preferredDate: appointment.preferredDate ?? "",
    preferredTime: appointment.preferredTime ?? "",
    insurance: appointment.insurance ?? null,

    /**
     * CRM always stores a boolean.
     */
    confirmed: appointment.confirmed ?? false,

    createdAt: new Date().toISOString(),
  };
}

/**
 * Merge AI actions with appointment-derived actions.
 */
export function mergeActions(
  response: AIResponse,
): AIAction[] {
  const evaluation = evaluateAppointment(
    response.appointment,
  );

  return [
    ...new Set<AIAction>([
      ...response.actions,
      ...evaluation.actions,
    ]),
  ];
}

/**
 * Convenience helper used by the conversation engine.
 */
export function processAppointment(
  response: AIResponse,
) {
  const evaluation = evaluateAppointment(
    response.appointment,
  );

  return {
    evaluation,

    crmRecord:
      response.appointment && evaluation.canBook
        ? toCRMAppointment(response.appointment)
        : null,

    actions: mergeActions(response),
  };
}