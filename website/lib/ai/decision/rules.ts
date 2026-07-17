// website/lib/ai/decision/rules.ts

import type { AIIntent } from "@/lib/ai/core/analysis";
import type { AIToolName } from "@/lib/ai/tools";

/**
 * ============================================================
 * PatientPilot AI
 * Decision Rules
 * ============================================================
 *
 * Defines the business rules for every supported intent.
 * The Decision Engine consumes these rules to determine
 * what information is required and what action to take.
 * ============================================================
 */

export interface IntentRule {
  /**
   * Fields required before the AI
   * can execute a business action.
   */
  requiredFields: string[];

  /**
   * Tool to execute once
   * all required fields exist.
   */
  tool?: AIToolName;

  /**
   * Human transfer required.
   */
  requiresHuman?: boolean;

  /**
   * Conversation ends after completion.
   */
  completeAfterExecution?: boolean;
}

/**
 * Rule definitions by intent.
 */
export const INTENT_RULES: Partial<
  Record<AIIntent, IntentRule>
> = {
  book_appointment: {
    requiredFields: [
      "patientName",
      "phoneNumber",
      "appointmentDate",
      "appointmentTime",
      "reason",
    ],

    tool: "appointment.create",

    completeAfterExecution: true,
  },

  new_patient: {
    requiredFields: [
      "patientName",
      "phoneNumber",
    ],

    tool: "patient.createOrUpdate",
  },

  existing_patient: {
    requiredFields: [
      "phoneNumber",
    ],

    tool: "patient.createOrUpdate",
  },

  emergency: {
    requiredFields: [],

    requiresHuman: true,
  },

  human_agent: {
    requiredFields: [],

    requiresHuman: true,
  },

  pricing: {
    requiredFields: [],
  },

  insurance: {
    requiredFields: [],
  },

  office_hours: {
    requiredFields: [],
  },

  billing: {
    requiredFields: [],
  },

  general_question: {
    requiredFields: [],
  },

  greeting: {
    requiredFields: [],
  },

  goodbye: {
    requiredFields: [],

    completeAfterExecution: true,
  },
};

/**
 * Returns the rule for an intent.
 */
export function getIntentRule(
  intent: AIIntent,
): IntentRule | undefined {
  return INTENT_RULES[intent];
}