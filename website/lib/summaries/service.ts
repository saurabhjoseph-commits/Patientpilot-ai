import {
  createSummary,
  deleteSummary,
  getSummary,
  getSummaryByCallSid,
  listSummaries,
  updateSummary,
} from "./repository";

import { generateSummary } from "./summary-generator";

import type {
  AICompletionResult,
  AIConversationSession,
} from "@/lib/ai/types";

import type {
  Appointment,
} from "@/lib/appointments/types";

import type {
  Patient,
} from "@/lib/patients/types";

import type {
  CallSummary,
  SummaryFilters,
  UpdateSummaryInput,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Summary Service
 * ============================================================
 *
 * Business layer.
 * ============================================================
 */

/**
 * Generate and save a summary.
 */
export async function createSummaryService(
  session: AIConversationSession,
  result: AICompletionResult,
  appointment?: Appointment,
  patient?: Patient
): Promise<CallSummary> {
  const existing =
    await getSummaryByCallSid(
      session.callSid
    );

  if (existing) {
    return existing;
  }

  const summary =
    generateSummary(
      session,
      result,
      appointment,
      patient
    );

  return createSummary(summary);
}

/**
 * Get summary.
 */
export async function getSummaryService(
  id: string
): Promise<CallSummary | null> {
  return getSummary(id);
}

/**
 * Find summary by Call SID.
 */
export async function getSummaryByCallSidService(
  callSid: string
): Promise<CallSummary | null> {
  return getSummaryByCallSid(callSid);
}

/**
 * List summaries.
 */
export async function listSummariesService(
  filters?: SummaryFilters
): Promise<CallSummary[]> {
  return listSummaries(filters);
}

/**
 * Update summary.
 */
export async function updateSummaryService(
  id: string,
  input: UpdateSummaryInput
): Promise<CallSummary> {
  return updateSummary(id, input);
}

/**
 * Delete summary.
 */
export async function deleteSummaryService(
  id: string
): Promise<void> {
  return deleteSummary(id);
}