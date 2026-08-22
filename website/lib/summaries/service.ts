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
import type { ClinicScope } from "@/lib/clinic/clinic-scope";
import { resolveCallOwnership } from "@/lib/calls/ownership";

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
  scope: ClinicScope,
  clinicName: string,
  appointment?: Appointment,
  patient?: Patient,
): Promise<CallSummary> {

  /**
   * RC5 Migration
   *
   * callId is now canonical.
   * callSid is retained temporarily for compatibility.
   */
  const callId =
    session.callSid ?? session.callId;

  if (!callId) {
    throw new Error(
      "Missing conversation call identifier.",
    );
  }

  if (!clinicName) {
    throw new Error("A trusted clinic scope is required to create a summary.");
  }

  const existing = await getSummaryByCallSid(callId, scope.clinicId);

  if (existing) {
    return existing;
  }

  const call = await resolveCallOwnership(scope, callId);
  const summary = generateSummary(session, result, scope, call, clinicName, appointment, patient);

  return createSummary(summary);
}

/**
 * Get summary.
 */
export async function getSummaryService(
  id: string,
  scope: ClinicScope,
): Promise<CallSummary | null> {
  return getSummary(id, scope.clinicId);
}

/**
 * Find summary by Call SID.
 */
export async function getSummaryByCallSidService(
  callSid: string,
  scope: ClinicScope,
): Promise<CallSummary | null> {
  return getSummaryByCallSid(callSid, scope.clinicId);
}

/**
 * List summaries.
 */
export async function listSummariesService(
  filters: SummaryFilters,
): Promise<CallSummary[]> {
  return listSummaries(filters);
}

/**
 * Update summary.
 */
export async function updateSummaryService(
  id: string,
  input: UpdateSummaryInput,
  scope: ClinicScope,
): Promise<CallSummary> {
  return updateSummary(id, input, scope.clinicId);
}

/**
 * Delete summary.
 */
export async function deleteSummaryService(
  id: string,
  scope: ClinicScope,
): Promise<void> {
  return deleteSummary(id, scope.clinicId);
}
