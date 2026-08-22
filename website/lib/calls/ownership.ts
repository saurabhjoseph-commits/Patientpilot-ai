import "server-only";

import { supabaseServer } from "@/lib/supabase-server";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";

export interface CallOwnership {
  readonly callId: string;
  readonly clinicId: string;
}

export class CallOwnershipError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CallOwnershipError";
  }
}

/**
 * Returns a call only when its provider identifier belongs to the trusted
 * server-derived clinic scope. The provider identifier is never a tenant key.
 */
export async function resolveCallOwnership(
  scope: ClinicScope,
  callSid: string,
): Promise<CallOwnership> {
  const { data, error } = await supabaseServer
    .from("calls")
    .select("id,clinic_id")
    .eq("call_sid", callSid)
    .eq("clinic_id", scope.clinicId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new CallOwnershipError("No clinic-scoped call exists for this provider callback.");
  }

  return { callId: data.id, clinicId: data.clinic_id };
}

/**
 * Creates the durable call record from the verified provider callback. A
 * conflicting existing CallSid is rejected rather than being reassigned.
 */
export async function ensureTelephonyCall(
  scope: ClinicScope,
  input: { callSid: string; phone: string },
): Promise<CallOwnership> {
  const { data: existing, error: lookupError } = await supabaseServer
    .from("calls")
    .select("id,clinic_id")
    .eq("call_sid", input.callSid)
    .maybeSingle();
  if (lookupError) throw lookupError;

  if (existing) {
    if (existing.clinic_id !== scope.clinicId) {
      throw new CallOwnershipError("Provider call is already bound to another clinic.");
    }
    return { callId: existing.id, clinicId: existing.clinic_id };
  }

  const { data: created, error: createError } = await supabaseServer
    .from("calls")
    .insert({
      call_sid: input.callSid,
      clinic_id: scope.clinicId,
      phone: input.phone,
      status: "ringing",
      ai_state: "listening",
      started_at: new Date().toISOString(),
    })
    .select("id,clinic_id")
    .single();

  if (!createError) return { callId: created.id, clinicId: created.clinic_id };

  // A concurrent verified callback may have won the unique CallSid insert.
  // Re-read only within the trusted scope; never overwrite another clinic.
  return resolveCallOwnership(scope, input.callSid);
}

export async function persistTelephonyCallStatus(scope: ClinicScope, callSid: string, status: string, durationSeconds: number): Promise<void> {
  const call = await resolveCallOwnership(scope, callSid);
  const terminal = ["completed", "busy", "failed", "no-answer", "canceled"].includes(status);
  const { error } = await supabaseServer.from("calls").update({
    status: status === "in-progress" ? "connected" : status,
    duration_seconds: Math.max(0, durationSeconds),
    answered_at: status === "in-progress" ? new Date().toISOString() : undefined,
    ended_at: terminal ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  }).eq("id", call.callId).eq("clinic_id", scope.clinicId);
  if (error) throw error;
}
