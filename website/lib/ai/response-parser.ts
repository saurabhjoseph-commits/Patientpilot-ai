import type {
  AIConversationState,
  AIIntent,
  AIResponse,
  AppointmentData,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Response Parser
 * ============================================================
 */

const STATE_KEYWORDS: Record<
  AIConversationState,
  string[]
> = {
  idle: [],
  greeting: ["welcome", "hello"],
  collecting_name: ["your name"],
  collecting_phone: ["phone", "number"],
  collecting_reason: ["reason", "help you with"],
  collecting_date: ["date", "day"],
  confirming: ["confirm", "correct"],
  completed: ["appointment confirmed"],
  handoff: ["human", "staff", "transfer"],
  ended: ["goodbye"],
};

const INTENT_KEYWORDS: Record<
  AIIntent,
  string[]
> = {
  unknown: [],

  book_appointment: [
    "appointment",
    "schedule",
    "book",
  ],

  reschedule_appointment: [
    "reschedule",
    "change appointment",
  ],

  cancel_appointment: [
    "cancel",
  ],

  office_hours: [
    "hours",
    "open",
    "close",
  ],

  insurance: [
    "insurance",
    "coverage",
  ],

  pricing: [
    "price",
    "cost",
    "fee",
  ],

  emergency: [
    "emergency",
    "pain",
    "bleeding",
  ],

  general_question: [
    "question",
  ],

  human_agent: [
    "human",
    "staff",
    "representative",
  ],
};

/**
 * ============================================================
 * Parse OpenAI Response
 * ============================================================
 */

export function parseAIResponse(
  text: string
): AIResponse {
  const message = text.trim();

  const state =
    detectState(message);

  const intent =
    detectIntent(message);

  return {
    message,

    state,

    intent,

    appointment: {},

    shouldHangup:
      state === "completed" ||
      state === "ended",
  };
}

/**
 * ============================================================
 * Detect State
 * ============================================================
 */

export function detectState(
  text: string
): AIConversationState {
  const value =
    text.toLowerCase();

  for (const state of Object.keys(
    STATE_KEYWORDS
  ) as AIConversationState[]) {
    const keywords =
      STATE_KEYWORDS[state];

    if (
      keywords.some((keyword) =>
        value.includes(keyword)
      )
    ) {
      return state;
    }
  }

  return "collecting_reason";
}

/**
 * ============================================================
 * Detect Intent
 * ============================================================
 */

export function detectIntent(
  text: string
): AIIntent {
  const value =
    text.toLowerCase();

  for (const intent of Object.keys(
    INTENT_KEYWORDS
  ) as AIIntent[]) {
    const keywords =
      INTENT_KEYWORDS[intent];

    if (
      keywords.some((keyword) =>
        value.includes(keyword)
      )
    ) {
      return intent;
    }
  }

  return "unknown";
}

/**
 * ============================================================
 * Build Appointment
 * ============================================================
 */

export function buildAppointment(
  appointment: Partial<AppointmentData>
): Partial<AppointmentData> {
  return {
    patientName:
      appointment.patientName,

    phoneNumber:
      appointment.phoneNumber,

    appointmentDate:
      appointment.appointmentDate,

    appointmentTime:
      appointment.appointmentTime,

    reason:
      appointment.reason,
  };
}

/**
 * ============================================================
 * Detect Human Handoff
 * ============================================================
 */

export function requiresHuman(
  response: AIResponse
): boolean {
  return (
    response.intent ===
      "human_agent" ||
    response.intent ===
      "emergency"
  );
}