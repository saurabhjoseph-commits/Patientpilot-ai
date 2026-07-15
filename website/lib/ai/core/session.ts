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
   * ----------------------------------------------------------------
   * Temporary RC4 compatibility.
   *
   * Older parts of the application still reference `callSid`
   * while the new domain model uses `callId`.
   *
   * Both point to the same value during the migration.
   * Remove `callSid` after RC4 is complete.
   * ----------------------------------------------------------------
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
   * Patient information.
   */
  patient: PatientData;

  /**
   * Appointment information.
   */
  appointment: AppointmentData;

  /**
   * Latest conversation analysis.
   */
  analysis?: ConversationAnalysis;

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