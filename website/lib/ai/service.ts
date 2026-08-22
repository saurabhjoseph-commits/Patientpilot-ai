// website/lib/ai/service.ts

import {
  createSession,
  getSession,
  updatePatient as updatePatientSession,
  recordRecognitionFailure as recordRecognitionFailureSession,
  resetRecognitionFailures as resetRecognitionFailuresSession,
} from "./session";

import { runWorkflow } from "./workflow";

import type {
  AIContext,
  AIConversationSession,
  AIIntent,
  AIMessage,
  AIResponse,
} from "./types";
import type { ClinicLanguageMode } from "@/lib/platform/domain/clinic-language";

/**
 * ============================================================
 * PatientPilot AI
 * AI Service (RC4 Compatibility Layer)
 * ============================================================
 */

export interface ConversationRequest {
  callId: string;
  context: AIContext;
  message: AIMessage;
  intent: AIIntent;
}

/**
 * Legacy API.
 * Called when a new phone call starts.
 */
export async function startConversation(
  clinicId: string,
  callId: string,
  configuredLanguageMode: ClinicLanguageMode = "english",
): Promise<AIConversationSession> {
  return createSession(clinicId, callId, configuredLanguageMode);
}

/**
 * Legacy API.
 */
export async function getConversation(
  clinicId: string,
  callId: string,
): Promise<AIConversationSession | null> {
  return getSession(clinicId, callId);
}

/**
 * Main AI conversation entry point.
 */
export async function continueConversation(
  request: ConversationRequest,
): Promise<AIResponse> {
  if (!request.callId) {
    throw new Error("Missing callId.");
  }

  if (!request.message) {
    throw new Error("Missing conversation message.");
  }

  return runWorkflow({
    clinicId: request.context.clinicId,
    callId: request.callId,
    context: request.context,
    message: request.message,
    intent: request.intent,
  });
}

/** Stores only the verified caller contact supplied by the telephony boundary. */
export function updatePatient(clinicId: string, callId: string, patient: AIConversationSession["patient"]): Promise<AIConversationSession> {
  return updatePatientSession(clinicId, callId, patient);
}

export async function recordRecognitionFailure(clinicId: string, callId: string): Promise<number> {
  const session = await recordRecognitionFailureSession(clinicId, callId);
  return session.recognitionFailureCount;
}

export async function resetRecognitionFailures(clinicId: string, callId: string): Promise<void> {
  await resetRecognitionFailuresSession(clinicId, callId);
}
