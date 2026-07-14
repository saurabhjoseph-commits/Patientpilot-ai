/**
 * ============================================================
 * PatientPilot AI
 * Structured AI Response Schema
 * ============================================================
 *
 * Defines ONLY the structured response returned by OpenAI.
 *
 * All shared application types come from types.ts.
 * ============================================================
 */

import type {
  AIConversationState,
  AIIntent,
  AppointmentData,
} from "./types";

/**
 * Structured JSON returned by OpenAI.
 */
export interface AIStructuredResponse {
  /**
   * Natural language reply spoken
   * back to the caller.
   */
  message: string;

  /**
   * Current conversation state.
   */
  state: AIConversationState;

  /**
   * Detected caller intent.
   */
  intent: AIIntent;

  /**
   * Confidence (0-100)
   */
  confidence: number;

  /**
   * End the conversation.
   */
  shouldHangup: boolean;

  /**
   * Extracted appointment.
   *
   * Null until enough
   * information has been collected.
   */
  appointment: AppointmentData | null;
}

/**
 * Returns true when
 * the AI has enough information
 * to create an appointment.
 */
export function isConversationComplete(
  response: AIStructuredResponse
): boolean {
  return (
    response.state === "completed" &&
    response.appointment !== null &&
    !!response.appointment.patientName &&
    !!response.appointment.phoneNumber &&
    !!response.appointment.appointmentDate &&
    !!response.appointment.appointmentTime &&
    !!response.appointment.reason
  );
}

/**
 * Safe fallback.
 */
export const EmptyStructuredResponse: AIStructuredResponse =
  {
    message:
      "I'm sorry, could you please repeat that?",

    state: "greeting",

    intent: "general_question",

    confidence: 0,

    shouldHangup: false,

    appointment: null,
  };