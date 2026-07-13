import type {
  AIConversationSession,
  AIConversationState,
  AIIntent,
  AppointmentData,
  ConversationAnalysis,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI Conversation Engine
 * ============================================================
 */

export interface ConversationDecision {
  nextState: AIConversationState;
  intent: AIIntent;
  completed: boolean;
  shouldHangup: boolean;
  needsHuman: boolean;
  missingFields: string[];
}

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
    return !value || String(value).trim() === "";
  }).map(String);
}

/**
 * Determines whether all appointment information has been collected.
 */
export function isAppointmentComplete(
  appointment: Partial<AppointmentData>
): boolean {
  return getMissingAppointmentFields(appointment).length === 0;
}

/**
 * Determines the next conversational state.
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
 * Basic keyword intent detection.
 * Later this can be replaced with GPT function-calling.
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
    value.includes("change appointment")
  ) {
    return "reschedule_appointment";
  }

  if (
    value.includes("cancel")
  ) {
    return "cancel_appointment";
  }

  if (
    value.includes("insurance")
  ) {
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
    value.includes("person") ||
    value.includes("human") ||
    value.includes("staff")
  ) {
    return "human_agent";
  }

  return "unknown";
}

/**
 * Determines whether the AI should transfer
 * the caller to a human.
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
 * Determines whether the conversation
 * should end.
 */
export function shouldEndConversation(
  state: AIConversationState,
  human: boolean
): boolean {
  if (human) {
    return true;
  }

  return (
    state === "completed" ||
    state === "ended"
  );
}

/**
 * Performs a complete conversation analysis.
 */
export function analyzeConversation(
  session: AIConversationSession,
  latestMessage: string
): ConversationAnalysis {
  const intent = detectIntent(latestMessage);

  const nextState = determineNextState(session);

  const human = needsHumanAgent(intent);

  const completed =
    nextState === "completed";

  const missingFields =
    getMissingAppointmentFields(
      session.appointment
    );

  return {
    nextState,
    intent,
    completed,
    shouldHangup: shouldEndConversation(
      nextState,
      human
    ),
    needsHuman: human,
    missingFields,
  };
}