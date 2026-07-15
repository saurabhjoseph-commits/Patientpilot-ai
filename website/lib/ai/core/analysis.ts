// website/lib/ai/core/analysis.ts

import type { AppointmentData } from "./appointment";

/**
 * ============================================================
 * PatientPilot AI
 * Analysis Domain
 * ============================================================
 */

export type AIIntent =
  | "unknown"
  | "greeting"
  | "new_patient"
  | "existing_patient"
  | "book_appointment"
  | "reschedule_appointment"
  | "cancel_appointment"
  | "pricing"
  | "insurance"
  | "office_hours"
  | "billing"
  | "general_question"
  | "emergency"
  | "human_agent"
  | "goodbye";

export type AIConversationState =
  | "idle"
  | "greeting"
  | "collecting_name"
  | "collecting_phone"
  | "collecting_reason"
  | "collecting_date"
  | "confirming"
  | "completed"
  | "handoff"
  | "ended";

export interface ConversationAnalysis {
  intent: AIIntent;

  nextState: AIConversationState;

  completed: boolean;

  shouldHangup: boolean;

  needsHuman: boolean;

  confidence: number;

  missingFields: string[];

  summary: string;
}

export interface ValidationResult {
  valid: boolean;

  score: number;

  errors: string[];

  missingFields: string[];
}

export interface AppointmentEvaluation {
  canBook: boolean;

  missingFields: string[];

  appointment?: AppointmentData;
}