/**
 * ============================================================
 * PatientPilot AI
 * RC4 Compatibility Layer
 * ============================================================
 *
 * Canonical domain models live under ./core.
 * During RC4, legacy modules continue importing from "./types".
 */

export * from "./core";

/* ============================================================
 * Legacy Type Aliases
 * ============================================================
 */

export type ConversationIntent =
  import("./core").AIIntent;

export type ConversationMessage =
  import("./core").AIMessage;

export type IntentAnalysis =
  import("./core").ConversationAnalysis;

/**
 * ============================================================
 * Prompt Builder Compatibility
 * ============================================================
 */

export interface AIContext {
  clinicName: string;

  timezone: string;

  officeHours: string;

  providers: string[];

  acceptedInsurance: string[];

  appointmentTypes: string[];
}

/**
 * Legacy prompt state used by prompts.ts
 */
export interface PromptConversationState {
  callId: string;

  status: string;

  messages: ConversationMessage[];
}

/**
 * Older modules import ConversationState.
 * Keep it pointing to the prompt model during migration.
 */
export type ConversationState =
  import("./core").AIConversationSession;