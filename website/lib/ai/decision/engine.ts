// website/lib/ai/decision/engine.ts

import { getIntentRule } from "./rules";

import type {
  DecisionContext,
  DecisionResult,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Decision Engine
 * ============================================================
 *
 * Evaluates the current conversation and determines
 * the next action.
 *
 * The engine does NOT:
 * - call OpenAI
 * - call Twilio
 * - access Supabase
 * - execute tools
 *
 * It only decides what should happen next.
 * ============================================================
 */

/**
 * Determine the next workflow decision.
 */
export function evaluateDecision(
  context: DecisionContext,
): DecisionResult {
  const {
    session,
    intent,
  } = context;

  const rule = getIntentRule(intent);

  if (!rule) {
    return {
      action: "ask",
      reason: "No rule found for intent.",
      nextQuestion:
        "How can I help you today?",
      missingFields: [],
    };
  }

  /**
   * Immediate human handoff.
   */
  if (rule.requiresHuman) {
    return {
      action: "handoff",
      reason:
        "Intent requires human assistance.",
      missingFields: [],
    };
  }

  /**
   * Determine missing fields.
   */
  const missingFields = rule.requiredFields.filter(
    (field) => !hasFieldValue(session, field),
  );

  /**
   * More information needed.
   */
  if (missingFields.length > 0) {
    return {
      action: "ask",
      reason:
        "Required information is missing.",
      nextQuestion: buildNextQuestion(
        missingFields[0],
      ),
      missingFields,
    };
  }

  /**
   * Ready to execute business action.
   */
  if (rule.tool) {
    return {
      action: "execute",
      tool: rule.tool,
      reason:
        "Required information collected.",
      missingFields: [],
    };
  }

  /**
   * Conversation finished.
   */
  return {
    action: "complete",
    reason:
      "Workflow completed.",
    missingFields: [],
  };
}

/**
 * Checks whether a required field
 * already exists inside the session.
 */
function hasFieldValue(
  session: DecisionContext["session"],
  field: string,
): boolean {

  switch (field) {

    case "patientName":
      return Boolean(
        session.patient.fullName,
      );

    case "phoneNumber":
      return Boolean(
        session.patient.phone,
      );

    case "appointmentDate":
      return Boolean(
        session.appointment.appointmentDate,
      );

    case "appointmentTime":
      return Boolean(
        session.appointment.appointmentTime,
      );

    case "reason":
      return Boolean(
        session.appointment.reason,
      );

    default:
      return false;
  }
}

/**
 * Returns the next question
 * for a missing field.
 */
function buildNextQuestion(
  field: string,
): string {

  switch (field) {

    case "patientName":
      return "May I have your full name?";

    case "phoneNumber":
      return "What is your phone number?";

    case "appointmentDate":
      return "Which day would you like to come in?";

    case "appointmentTime":
      return "What time works best for you?";

    case "reason":
      return "What is the reason for your visit?";

    default:
      return "Could you tell me more?";
  }
}