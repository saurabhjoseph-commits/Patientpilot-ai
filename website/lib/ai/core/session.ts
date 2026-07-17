// website/lib/ai/core/session.ts

import type { AIMessage } from "./message";
import type { AppointmentData } from "./appointment";
import type {
  AIConversationState,
  AIIntent,
  ConversationAnalysis,
} from "./analysis";
import type { PatientData } from "./patient";

/**
 * ============================================================
 * PatientPilot AI
 * Session Domain
 * ============================================================
 */

export interface AIConversationSession {
  /**
   * Internal session id.
   */
  id: string;

  /**
   * Canonical call identifier.
   */
  callId: string;

  /**
   * Temporary RC4 compatibility.
   */
  callSid?: string;

  /**
   * Current workflow state.
   */
  state: AIConversationState;

  /**
   * Current detected intent.
   */
  intent: AIIntent;

  /**
   * Conversation history.
   */
  messages: AIMessage[];

  /**
   * Patient information collected so far.
   */
  patient: PatientData;

  /**
   * Appointment information collected so far.
   */
  appointment: AppointmentData;

  /**
   * Latest AI analysis.
   */
  analysis?: ConversationAnalysis;

  /**
   * Fields still required before the conversation
   * can complete successfully.
   */
  missingFields: string[];

  /**
   * Current step in the conversation.
   *
   * Examples:
   * greeting
   * collect-name
   * collect-phone
   * collect-date
   * confirm
   * complete
   */
  currentStep: string;

  /**
   * AI confidence (0–1).
   */
  confidence: number;

  /**
   * Conversation completed successfully.
   */
  completed: boolean;

  /**
   * AI determined that a human should take over.
   */
  needsHuman: boolean;

  createdAt: string;

  updatedAt: string;

  endedAt?: string;
}

/**
 * ============================================================
 * Backward compatibility
 * ============================================================
 */

export type ConversationState = AIConversationSession;