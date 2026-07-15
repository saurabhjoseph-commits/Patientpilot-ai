// website/lib/ai/conversation-utils.ts

import type {
  AIConversationSession,
  AIConversationState,
  AIIntent,
  AppointmentData,
} from "./core";

/**
 * ============================================================
 * PatientPilot AI
 * Conversation Utilities
 * Pure helper functions only.
 * No session mutation.
 * No OpenAI.
 * No validation.
 * ============================================================
 */

const REQUIRED_FIELDS: (keyof AppointmentData)[] = [
  "patientName",
  "phoneNumber",
  "reason",
  "preferredDate",
  "preferredTime",
];

/**
 * Returns missing appointment fields.
 */
export function getMissingAppointmentFields(
  appointment: Partial<AppointmentData>,
): string[] {
  return REQUIRED_FIELDS.filter((field) => {
    const value = appointment[field];

    return (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    );
  }).map(String);
}

/**
 * True if appointment has all required fields.
 */
export function isAppointmentComplete(
  appointment: Partial<AppointmentData>,
): boolean {
  return (
    getMissingAppointmentFields(appointment).length === 0
  );
}

/**
 * Normalize a phone number.
 */
export function normalizePhone(
  phone?: string,
): string | undefined {
  if (!phone) {
    return undefined;
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }

  return phone.trim();
}

/**
 * Normalize whitespace.
 */
export function normalizeText(
  value?: string,
): string {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

/**
 * Convert to title case.
 */
export function titleCase(
  value?: string,
): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Basic intent detection.
 * Temporary rule-based implementation.
 */
export function detectIntent(
  text: string,
): AIIntent {
  const value = text.toLowerCase();

  if (
    value.includes("book") ||
    value.includes("appointment")
  ) {
    return "book_appointment";
  }

  if (value.includes("reschedule")) {
    return "reschedule_appointment";
  }

  if (value.includes("cancel")) {
    return "cancel_appointment";
  }

  if (value.includes("insurance")) {
    return "insurance";
  }

  if (
    value.includes("price") ||
    value.includes("cost")
  ) {
    return "pricing";
  }

  if (
    value.includes("emergency") ||
    value.includes("pain")
  ) {
    return "emergency";
  }

  if (
    value.includes("human") ||
    value.includes("staff")
  ) {
    return "human_agent";
  }

  return "unknown";
}

/**
 * Predict the next conversation state.
 *
 * NOTE:
 * This is a lightweight helper.
 * The authoritative workflow remains in state-machine.ts.
 */
export function determineNextState(
  session: AIConversationSession,
): AIConversationState {
  const a = session.appointment;

  if (!a.patientName) {
    return "collecting_name";
  }

  if (!a.phoneNumber) {
    return "collecting_phone";
  }

  if (!(a.reason || a.procedure)) {
    return "collecting_reason";
  }

  if (!(a.preferredDate || a.appointmentDate)) {
    return "collecting_date";
  }

  if (!(a.preferredTime || a.appointmentTime)) {
    return "confirming";
  }

  return "completed";
}

/**
 * Whether a human should take over.
 */
export function needsHumanAgent(
  intent: AIIntent,
): boolean {
  return (
    intent === "human_agent" ||
    intent === "emergency"
  );
}

/**
 * Whether the conversation should end.
 */
export function shouldEndConversation(
  state: AIConversationState,
  human: boolean,
): boolean {
  return (
    human ||
    state === "completed" ||
    state === "ended"
  );
}

/**
 * Simple confidence calculation.
 */
export function calculateConfidence(
  missingFields: string[],
): number {
  return Math.max(
    0,
    100 - missingFields.length * 20,
  );
}