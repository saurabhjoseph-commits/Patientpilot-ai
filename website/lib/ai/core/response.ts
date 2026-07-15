// website/lib/ai/core/response.ts

import type { AppointmentData } from "./appointment";
import type {
  AIIntent,
  ConversationAnalysis,
} from "./analysis";
import type { AIConversationSession } from "./session";

/**
 * Import the prompt context used by the AI prompt builder.
 */
import type { AIContext } from "../types";

/**
 * ============================================================
 * PatientPilot AI
 * Response Domain
 * ============================================================
 */

export enum AIAction {
  NONE = "NONE",

  BOOK_APPOINTMENT = "BOOK_APPOINTMENT",

  RESCHEDULE_APPOINTMENT = "RESCHEDULE_APPOINTMENT",

  CANCEL_APPOINTMENT = "CANCEL_APPOINTMENT",

  SEND_SMS_CONFIRMATION = "SEND_SMS_CONFIRMATION",

  SEND_EMAIL_CONFIRMATION = "SEND_EMAIL_CONFIRMATION",

  TRANSFER_TO_HUMAN = "TRANSFER_TO_HUMAN",

  END_CALL = "END_CALL",
}

export interface AIResponse {
  /**
   * Human-readable response.
   * (Legacy compatibility)
   */
  message: string;

  /**
   * Spoken response used by TTS.
   */
  speech: string;

  /**
   * Detected patient intent.
   */
  intent: AIIntent;

  /**
   * Overall confidence (0–100).
   */
  confidence: number;

  /**
   * Structured analysis.
   */
  analysis: ConversationAnalysis;

  /**
   * Appointment extracted during the conversation.
   */
  appointment?: AppointmentData;

  /**
   * Workflow actions.
   */
  actions: AIAction[];

  /**
   * Whether the call should end.
   */
  shouldHangup: boolean;

  /**
   * Updated conversation state.
   */
  state: AIConversationSession;
}

/**
 * ============================================================
 * Conversation Request
 * ============================================================
 */

export interface ConversationRequest {
  /**
   * Current conversation state.
   */
  state: AIConversationSession;

  /**
   * Latest patient utterance.
   */
  latestMessage: {
    content: string;
  };

  /**
   * Clinic context used to build prompts.
   */
  context: AIContext;
}

/**
 * ============================================================
 * AI Completion Result
 * ============================================================
 */

export interface AICompletionResult {
  response: AIResponse;

  analysis: ConversationAnalysis;

  actions: AIAction[];
}