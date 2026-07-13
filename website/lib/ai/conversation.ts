import type {
  AIConversationSession,
  AIConversationState,
  AIIntent,
  AppointmentData,
  ConversationAnalysis,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Conversation Utilities
 * ============================================================
 */

const REQUIRED_APPOINTMENT_FIELDS: (keyof AppointmentData)[] = [
  "patientName",
  "phoneNumber",
  "appointmentDate",
  "appointmentTime",
  "reason",
];

/**
 * Returns appointment fields that still need to be collected.
 */
export function getMissingAppointmentFields(
  appointment: Partial<AppointmentData>
): string[] {
  return REQUIRED_APPOINTMENT_FIELDS.filter((field) => {
    const value = appointment[field];

    return (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    );
  }).map(String);
}

/**
 * Returns true if all appointment fields exist.
 */
export function isAppointmentComplete(
  appointment: Partial<AppointmentData>
): boolean {
  return (
    getMissingAppointmentFields(appointment)
      .length === 0
  );
}

/**
 * Basic keyword intent detection.
 */
export function detectIntent(
  text: string
): AIIntent {
  const value = text.toLowerCase();

  if (
    value.includes("book") ||
    value.includes("appointment")
  ) {
    return "book_appointment";
  }

  if (
    value.includes("reschedule") ||
    value.includes("change")
  ) {
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
    value.includes("hours") ||
    value.includes("open")
  ) {
    return "office_hours";
  }

  if (
    value.includes("pain") ||
    value.includes("bleeding") ||
    value.includes("emergency")
  ) {
    return "emergency";
  }

  if (
    value.includes("human") ||
    value.includes("person") ||
    value.includes("staff")
  ) {
    return "human_agent";
  }

  return "unknown";
}

/**
 * Determine the next conversation state.
 */
export function determineNextState(
  session: AIConversationSession
): AIConversationState {
  const appointment = session.appointment;

  if (!appointment.patientName) {
    return "collecting_name";
  }

  if (!appointment.phoneNumber) {
    return "collecting_phone";
  }

  if (!appointment.reason) {
    return "collecting_reason";
  }

  if (!appointment.appointmentDate) {
    return "collecting_date";
  }

  if (!appointment.appointmentTime) {
    return "confirming";
  }

  return "completed";
}

/**
 * Returns true if a human should take over.
 */
export function needsHumanAgent(
  intent: AIIntent
): boolean {
  return (
    intent === "emergency" ||
    intent === "human_agent"
  );
}

/**
 * Determines if the call should end.
 */
export function shouldEndConversation(
  state: AIConversationState,
  needsHuman: boolean
): boolean {
  if (needsHuman) {
    return true;
  }

  return (
    state === "completed" ||
    state === "ended"
  );
}

/**
 * Full conversation analysis.
 */
export function analyzeConversation(
  session: AIConversationSession,
  latestMessage: string
): ConversationAnalysis {
  const intent = detectIntent(latestMessage);

  const nextState =
    determineNextState(session);

  const missingFields =
    getMissingAppointmentFields(
      session.appointment
    );

  const completed =
    nextState === "completed";

  const human =
    needsHumanAgent(intent);

  return {
    nextState,
    intent,
    completed,
    shouldHangup:
      shouldEndConversation(
        nextState,
        human
      ),
    needsHuman: human,
    missingFields,
    confidence: Math.max(
      0,
      100 - missingFields.length * 20
    ),
  };
}