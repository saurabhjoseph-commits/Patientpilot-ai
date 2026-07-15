// website/lib/ai/parser.ts

import type {
  AIResponse,
  ConversationAnalysis,
  AppointmentData,
  AIAction,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Structured Response Parser
 * ============================================================
 *
 * Converts the JSON returned by OpenAI into the
 * canonical AIResponse model.
 *
 * This file intentionally performs no business logic.
 * Validation is handled by validators.ts.
 */

/**
 * Raw JSON returned by OpenAI.
 */
interface RawAIResponse {
  message?: unknown;

  speech?: unknown;

  intent?: unknown;

  confidence?: unknown;

  shouldHangup?: unknown;

  actions?: unknown;

  analysis?: unknown;

  appointment?: unknown;
}

/**
 * Safe string conversion.
 */
function asString(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string"
    ? value.trim()
    : fallback;
}

/**
 * Safe boolean conversion.
 */
function asBoolean(
  value: unknown,
): boolean {
  return value === true;
}

/**
 * Safe number conversion.
 */
function asNumber(
  value: unknown,
  fallback = 0,
): number {
  return typeof value === "number"
    ? value
    : fallback;
}

/**
 * Safe string array conversion.
 */
function asStringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string",
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
      asString(
        analysis.intent,
        "unknown",
      ) as ConversationAnalysis["intent"],

    nextState:
      asString(
        analysis.nextState,
        "greeting",
      ) as ConversationAnalysis["nextState"],

    completed:
      asBoolean(
        analysis.completed,
      ),

    shouldHangup:
      asBoolean(
        analysis.shouldHangup,
      ),

    needsHuman:
      asBoolean(
        analysis.needsHuman,
      ),

    confidence:
      asNumber(
        analysis.confidence,
      ),

    missingFields:
      asStringArray(
        analysis.missingFields,
      ),

    summary:
      asString(
        analysis.summary,
      ),
  };
}

/**
 * Parse appointment information.
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
    value as Record<
      string,
      unknown
    >;

  return {
    patientName:
      asString(
        appointment.patientName,
      ),

    phoneNumber:
      asString(
        appointment.phoneNumber,
      ),

    email:
      asString(
        appointment.email,
      ),

    procedure:
      asString(
        appointment.procedure,
      ),

    reason:
      asString(
        appointment.reason,
      ),

    dentist:
      asString(
        appointment.dentist,
      ),

    insurance:
      asString(
        appointment.insurance,
      ),

    preferredDate:
      asString(
        appointment.preferredDate,
      ),

    preferredTime:
      asString(
        appointment.preferredTime,
      ),

    confirmed:
      asBoolean(
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
    (action): action is AIAction =>
      typeof action === "string",
  );
}

/**
 * ============================================================
 * Public parser
 * ============================================================
 */

export function parseAIResponse(
  json: string,
): Omit<AIResponse, "state"> {

  const raw =
    JSON.parse(json) as RawAIResponse;

  return {
    message:
      asString(raw.message),

    speech:
      asString(
        raw.speech,
      ) ||
      asString(raw.message),

    intent:
      asString(
        raw.intent,
        "unknown",
      ) as AIResponse["intent"],

    confidence:
      asNumber(
        raw.confidence,
      ),

    shouldHangup:
      asBoolean(
        raw.shouldHangup,
      ),

    analysis:
      parseAnalysis(
        raw.analysis,
      ),

    appointment:
      parseAppointment(
        raw.appointment,
      ),

    actions:
      parseActions(
        raw.actions,
      ),
  };
}