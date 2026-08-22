import { supabaseServer } from "@/lib/supabase-server";

import type {
  CallSummary,
  CreateSummaryInput,
  SummaryFilters,
  UpdateSummaryInput,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Summary Repository
 * ============================================================
 *
 * Data access layer for AI call summaries.
 * Only this file communicates with Supabase.
 * ============================================================
 */

const TABLE = "call_summaries";

/**
 * Create summary.
 */
export async function createSummary(
  input: CreateSummaryInput
): Promise<CallSummary> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .insert({
      clinic_id: input.clinicId,
      call_id: input.callId,
      call_sid: input.callSid,
      clinic_name: input.clinicName,
      patient_name: input.patientName,
      phone_number: input.phoneNumber,
      intent: input.intent,
      outcome: input.outcome,
      summary: input.summary,
      action_items: input.actionItems ?? [],
      appointment_id: input.appointmentId,
      patient_id: input.patientId,
      confidence: input.confidence ?? 100,
      duration_seconds: input.durationSeconds,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapSummary(data);
}

/**
 * Get summary.
 */
export async function getSummary(
  id: string,
  clinicId: string,
): Promise<CallSummary | null> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .eq("clinic_id", clinicId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapSummary(data) : null;
}

/**
 * Find summary by Call SID.
 */
export async function getSummaryByCallSid(
  callSid: string,
  clinicId: string,
): Promise<CallSummary | null> {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .eq("call_sid", callSid)
    .eq("clinic_id", clinicId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapSummary(data) : null;
}

/**
 * List summaries.
 */
export async function listSummaries(
  filters: SummaryFilters
): Promise<CallSummary[]> {
  let query = supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  query = query.eq("clinic_id", filters.clinicId);

  if (filters?.callSid) {
    query = query.eq(
      "call_sid",
      filters.callSid
    );
  }

  if (filters?.clinicName) {
    query = query.eq(
      "clinic_name",
      filters.clinicName
    );
  }

  if (filters?.patientName) {
    query = query.ilike(
      "patient_name",
      `%${filters.patientName}%`
    );
  }

  if (filters?.phoneNumber) {
    query = query.eq(
      "phone_number",
      filters.phoneNumber
    );
  }

  if (filters?.outcome) {
    query = query.eq(
      "outcome",
      filters.outcome
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapSummary);
}

/**
 * Update summary.
 */
export async function updateSummary(
  id: string,
  input: UpdateSummaryInput,
  clinicId: string,
): Promise<CallSummary> {
  const updates: Record<string, unknown> = {};

  if (input.patientName !== undefined)
    updates.patient_name = input.patientName;

  if (input.phoneNumber !== undefined)
    updates.phone_number = input.phoneNumber;

  if (input.intent !== undefined)
    updates.intent = input.intent;

  if (input.outcome !== undefined)
    updates.outcome = input.outcome;

  if (input.summary !== undefined)
    updates.summary = input.summary;

  if (input.actionItems !== undefined)
    updates.action_items = input.actionItems;

  if (input.appointmentId !== undefined)
    updates.appointment_id = input.appointmentId;

  if (input.patientId !== undefined)
    updates.patient_id = input.patientId;

  if (input.confidence !== undefined)
    updates.confidence = input.confidence;

  if (input.durationSeconds !== undefined)
    updates.duration_seconds =
      input.durationSeconds;

  const { data, error } =
    await supabaseServer
      .from(TABLE)
      .update(updates)
      .eq("id", id)
      .eq("clinic_id", clinicId)
      .select()
      .single();

  if (error) {
    throw error;
  }

  return mapSummary(data);
}

/**
 * Delete summary.
 */
export async function deleteSummary(
  id: string,
  clinicId: string,
): Promise<void> {
  const { error } = await supabaseServer
    .from(TABLE)
    .delete()
    .eq("id", id)
    .eq("clinic_id", clinicId);

  if (error) {
    throw error;
  }
}

/**
 * Convert database row into CallSummary.
 */
interface SummaryRow {
  id: string;
  clinic_id: string;
  call_id: string;
  call_sid: string;
  clinic_name: string;
  patient_name: string | null;
  phone_number: string | null;
  intent: string;
  outcome: CallSummary["outcome"];
  summary: string;
  action_items: string[] | null;
  appointment_id: string | null;
  patient_id: string | null;
  confidence: number;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

function mapSummary(row: SummaryRow): CallSummary {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    callId: row.call_id,
    callSid: row.call_sid,
    clinicName: row.clinic_name,
    patientName: row.patient_name ?? undefined,
    phoneNumber: row.phone_number ?? undefined,
    intent: row.intent,
    outcome: row.outcome,
    summary: row.summary,
    actionItems: row.action_items ?? [],
    appointmentId: row.appointment_id ?? undefined,
    patientId: row.patient_id ?? undefined,
    confidence: row.confidence,
    durationSeconds: row.duration_seconds ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
