// website/lib/ai/execution/parser.ts

import type {
  AIResponse,
  AIAction,
  AppointmentData,
  ConversationAnalysis,
} from "../core";

/**
 * ============================================================
 * PatientPilot AI
 * RC5 Execution Engine
 * Structured Response Parser
 * ============================================================
 *
 * Converts OpenAI JSON into the canonical domain model.
 *
 * No business rules belong here.
 * Validators handle business logic.
 */

/**
 * Safely parse JSON.
 */
function parseJson(json: string): Record<string, unknown> {
  try {
    return JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON returned by OpenAI.");
  }
}

function stringValue(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string"
    ? value.trim()
    : fallback;
}

function booleanValue(
  value: unknown,
): boolean {
  return value === true;
}

function numberValue(
  value: unknown,
  fallback = 0,
): number {
  return typeof value === "number"
    ? value
    : fallback;
}

function stringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (v): v is string =>
      typeof v === "string",
  );
}

/**
 * Parse ConversationAnalysis.
 */
function parseAnalysis(
  value: unknown,
): ConversationAnalysis {

  const analysis =
    typeof value === "object" &&
    value !== null
      ? value as Record<string, unknown>
      : {};

  return {
    intent:
      stringValue(
        analysis.intent,
        "unknown",
      ) as ConversationAnalysis["intent"],

    nextState:
      stringValue(
        analysis.nextState,
        "greeting",
      ) as ConversationAnalysis["nextState"],

    completed:
      booleanValue(
        analysis.completed,
      ),

    shouldHangup:
      booleanValue(
        analysis.shouldHangup,
      ),

    needsHuman:
      booleanValue(
        analysis.needsHuman,
      ),

    confidence:
      numberValue(
        analysis.confidence,
      ),

    missingFields:
      stringArray(
        analysis.missingFields,
      ),

    summary:
      stringValue(
        analysis.summary,
      ),
  };
}

/**
 * Parse appointment object.
 */
function parseAppointment(
  value: unknown,
): AppointmentData | undefined {

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return undefined;
  }

  const appointment =
    value as Record<string, unknown>;

  return {
    patientName:
      stringValue(
        appointment.patientName,
      ),

    phoneNumber:
      stringValue(
        appointment.phoneNumber,
      ),

    email:
      stringValue(
        appointment.email,
      ),

    procedure:
      stringValue(
        appointment.procedure,
      ),

    reason:
      stringValue(
        appointment.reason,
      ),

    dentist:
      stringValue(
        appointment.dentist,
      ),

    insurance:
      stringValue(
        appointment.insurance,
      ),

    preferredDate:
      stringValue(
        appointment.preferredDate,
      ),

    preferredTime:
      stringValue(
        appointment.preferredTime,
      ),

    confirmed:
      booleanValue(
        appointment.confirmed,
      ),
  };
}

/**
 * Parse AI actions.
 */
function parseActions(
  value: unknown,
): AIAction[] {

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is AIAction =>
      typeof item === "string",
  );
}

/**
 * ============================================================
 * Public Parser
 * ============================================================
 */

export function parseAIResponse(
  json: string,
): Omit<AIResponse, "state"> {

  const data = parseJson(json);

  return {
    message:
      stringValue(
        data.message,
      ),

    speech:
      stringValue(
        data.speech,
      ) ||
      stringValue(
        data.message,
      ),

    intent:
      stringValue(
        data.intent,
        "unknown",
      ) as AIResponse["intent"],

    confidence:
      numberValue(
        data.confidence,
      ),

    shouldHangup:
      booleanValue(
        data.shouldHangup,
      ),

    analysis:
      parseAnalysis(
        data.analysis,
      ),

    appointment:
      parseAppointment(
        data.appointment,
      ),

    actions:
      parseActions(
        data.actions,
      ),
  };
}