import "server-only";

import { supabaseServer } from "@/lib/supabase-server";
import type { ClinicOwnerAccount } from "./owner-account";

export type OwnerOnboardingStatus = "pending" | "inviting" | "invited" | "active" | "failed" | "cancelled";
export interface OwnerOnboardingRecord { readonly id: string; readonly clinic_id: string; readonly auth_user_id: string | null; readonly owner_email: string; readonly owner_full_name: string; readonly role: "owner" | "manager"; readonly status: OwnerOnboardingStatus; readonly invitation_sent_at: string | null; readonly activation_completed_at: string | null; readonly attempt_count: number; readonly failure_code: string | null; }
export class OwnerOnboardingError extends Error {
  constructor(message: string, readonly code?: "OWNER_AUTH_IDENTITY_MISSING" | "OWNER_AUTH_IDENTITY_EXISTS" | "OWNER_EMAIL_ALREADY_EXISTS") { super(message); }
}

const ONBOARDING_COLUMNS = "id,clinic_id,auth_user_id,owner_email,owner_full_name,role,status,invitation_sent_at,activation_completed_at,attempt_count,failure_code";

export async function assertOwnerOnboardingReady(owner: ClinicOwnerAccount): Promise<void> {
  const { error } = await supabaseServer.from("clinic_owner_onboarding").select("id", { head: true, count: "exact" }).limit(1);
  if (error) throw new OwnerOnboardingError("Owner onboarding is unavailable until approved migration 0015 is applied.");
  const email = owner.email.trim().toLowerCase();
  if (await authUserExists(email)) throw new OwnerOnboardingError("That owner email already belongs to an Auth account. Use a different email or resolve the existing account first.", "OWNER_EMAIL_ALREADY_EXISTS");
}

async function authUserExists(email: string): Promise<boolean> {
  for (let page = 1; page <= 100; page += 1) {
    const { data, error: usersError } = await supabaseServer.auth.admin.listUsers({ page, perPage: 1000 });
    if (usersError) throw new OwnerOnboardingError("Unable to verify the owner email before creating the clinic.");
    if ((data.users ?? []).some((user) => user.email?.toLowerCase() === email)) return true;
    if ((data.users ?? []).length < 1000) return false;
  }
  throw new OwnerOnboardingError("Unable to verify the owner email across the complete Auth directory.");
}

export async function startOwnerOnboarding(clinicId: string, owner: ClinicOwnerAccount): Promise<OwnerOnboardingRecord> {
  const email = owner.email.trim().toLowerCase();
  const { data: created, error: createError } = await supabaseServer.from("clinic_owner_onboarding").insert({ clinic_id: clinicId, owner_email: email, owner_full_name: owner.fullName.trim(), role: owner.role, status: owner.sendInvitation ? "inviting" : "pending", attempt_count: owner.sendInvitation ? 1 : 0, last_attempt_at: owner.sendInvitation ? new Date().toISOString() : null }).select(ONBOARDING_COLUMNS).single();
  if (createError || !created) throw new OwnerOnboardingError("Clinic was created but owner onboarding could not be recorded. Administrator recovery is required.");
  if (!owner.sendInvitation) return created as OwnerOnboardingRecord;
  return sendInvitation(created as OwnerOnboardingRecord);
}

export async function getOwnerOnboarding(clinicId: string): Promise<OwnerOnboardingRecord | null> {
  const { data, error } = await supabaseServer.from("clinic_owner_onboarding").select(ONBOARDING_COLUMNS).eq("clinic_id", clinicId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) return null;
  return data as OwnerOnboardingRecord | null;
}

export async function isOwnerOnboardingAvailable(): Promise<boolean> {
  const { error } = await supabaseServer.from("clinic_owner_onboarding").select("id", { head: true, count: "exact" }).limit(1);
  return !error;
}

export async function resendOwnerActivation(clinicId: string): Promise<OwnerOnboardingRecord> {
  const record = await requiredRecord(clinicId);
  if (!record.auth_user_id) throw new OwnerOnboardingError("The owner account was not created. Retry owner setup from the clinic details page.", "OWNER_AUTH_IDENTITY_MISSING");
  if (record.status === "active") throw new OwnerOnboardingError("The owner account is already active.");
  const { error } = await supabaseServer.auth.resetPasswordForEmail(record.owner_email, { redirectTo: activationCallbackUrl("/reset-password") });
  if (error) return fail(record, "activation_resend_failed");
  return updateRecord(record.id, { status: "invited", invitation_sent_at: new Date().toISOString(), last_attempt_at: new Date().toISOString(), attempt_count: record.attempt_count + 1, failure_code: null });
}

export async function retryOwnerProfileSetup(clinicId: string): Promise<OwnerOnboardingRecord> {
  const record = await requiredRecord(clinicId);
  if (!record.auth_user_id) throw new OwnerOnboardingError("No Auth identity exists yet. Retry owner setup instead.", "OWNER_AUTH_IDENTITY_MISSING");
  const { data: profile, error: profileError } = await supabaseServer.from("profiles").select("id,clinic_id,role").eq("id", record.auth_user_id).maybeSingle();
  if (profileError) throw new OwnerOnboardingError("Unable to verify the owner profile.");
  if (profile && (profile.clinic_id !== clinicId || profile.role !== record.role)) throw new OwnerOnboardingError("The existing profile is linked to a different clinic or role and cannot be changed automatically.");
  if (!profile) {
    const { error } = await supabaseServer.from("profiles").insert({ id: record.auth_user_id, clinic_id: clinicId, full_name: record.owner_full_name, role: record.role });
    if (error) return fail(record, "profile_setup_failed");
  }
  return updateRecord(record.id, { status: "invited", failure_code: null, last_attempt_at: new Date().toISOString(), attempt_count: record.attempt_count + 1 });
}

/** Reuses a pending/failed onboarding row to create its first Auth identity. */
export async function retryOwnerAuthSetup(clinicId: string): Promise<OwnerOnboardingRecord> {
  const { data: clinic, error: clinicError } = await supabaseServer.from("clinics").select("id").eq("id", clinicId).maybeSingle();
  if (clinicError || !clinic) throw new OwnerOnboardingError("Clinic was not found.");
  const record = await requiredRecord(clinicId);
  if (record.auth_user_id) throw new OwnerOnboardingError("An Auth identity already exists for this owner. Use resend invitation or retry profile setup.", "OWNER_AUTH_IDENTITY_EXISTS");
  if (await authUserExists(record.owner_email)) throw new OwnerOnboardingError("The owner email already belongs to an Auth account and cannot be linked automatically.", "OWNER_EMAIL_ALREADY_EXISTS");
  const inviting = await updateRecord(record.id, { status: "inviting", last_attempt_at: new Date().toISOString(), attempt_count: record.attempt_count + 1, failure_code: null });
  return sendInvitation(inviting);
}

/** Keeps the verified Auth/profile binding and only reopens workflow state. */
export async function resetOwnerOnboarding(clinicId: string): Promise<OwnerOnboardingRecord> {
  const record = await requiredRecord(clinicId);
  if (record.auth_user_id) {
    const { data: profile, error } = await supabaseServer.from("profiles").select("clinic_id,role").eq("id", record.auth_user_id).maybeSingle();
    if (error) throw new OwnerOnboardingError("Unable to verify the existing owner profile before reset.");
    if (profile && (profile.clinic_id !== clinicId || profile.role !== record.role)) {
      throw new OwnerOnboardingError("The existing Auth/profile mapping is not exclusively verified for this clinic and cannot be reset automatically.");
    }
  }
  return updateRecord(record.id, {
    status: "pending", invitation_sent_at: null, activation_completed_at: null, failure_code: null,
    last_attempt_at: new Date().toISOString(), attempt_count: record.attempt_count + 1,
  });
}

export async function completeOwnerActivation(authUserId: string): Promise<boolean> {
  const { data, error } = await supabaseServer.from("clinic_owner_onboarding").select(ONBOARDING_COLUMNS).eq("auth_user_id", authUserId).in("status", ["invited", "inviting", "failed"]).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error || !data) return false;
  const record = data as OwnerOnboardingRecord;
  const { data: profile, error: profileError } = await supabaseServer.from("profiles").select("clinic_id,role").eq("id", authUserId).maybeSingle();
  if (profileError || !profile || profile.clinic_id !== record.clinic_id || profile.role !== record.role) return false;
  await updateRecord(record.id, { status: "active", activation_completed_at: new Date().toISOString(), failure_code: null });
  return true;
}

export async function requiresOwnerPasswordChange(authUserId: string): Promise<boolean> {
  const { data, error } = await supabaseServer.from("clinic_owner_onboarding").select("status").eq("auth_user_id", authUserId).in("status", ["pending", "inviting", "invited", "failed"]).limit(1).maybeSingle();
  return !error && Boolean(data);
}

async function sendInvitation(record: OwnerOnboardingRecord): Promise<OwnerOnboardingRecord> {
  const { data, error } = await supabaseServer.auth.admin.inviteUserByEmail(record.owner_email, { data: { full_name: record.owner_full_name }, redirectTo: activationCallbackUrl("/set-password") });
  if (error || !data.user) return fail(record, "invitation_failed");
  const { data: existingProfile, error: profileCheckError } = await supabaseServer.from("profiles").select("id,clinic_id,role").eq("id", data.user.id).maybeSingle();
  if (profileCheckError || (existingProfile && (existingProfile.clinic_id !== record.clinic_id || existingProfile.role !== record.role))) return fail(record, "profile_conflict", data.user.id);
  if (!existingProfile) {
    const { error: profileError } = await supabaseServer.from("profiles").insert({ id: data.user.id, clinic_id: record.clinic_id, full_name: record.owner_full_name, role: record.role });
    if (profileError) return fail(record, "profile_setup_failed", data.user.id);
  }
  return updateRecord(record.id, { auth_user_id: data.user.id, status: "invited", invitation_sent_at: new Date().toISOString(), last_attempt_at: new Date().toISOString(), failure_code: null });
}

async function requiredRecord(clinicId: string): Promise<OwnerOnboardingRecord> { const record = await getOwnerOnboarding(clinicId); if (!record) throw new OwnerOnboardingError("No owner onboarding record exists for this clinic."); return record; }
async function fail(record: OwnerOnboardingRecord, failureCode: string, authUserId?: string): Promise<OwnerOnboardingRecord> { return updateRecord(record.id, { status: "failed", auth_user_id: authUserId ?? record.auth_user_id, failure_code: failureCode.slice(0, 100), last_attempt_at: new Date().toISOString(), attempt_count: record.attempt_count + 1 }); }
async function updateRecord(id: string, updates: Record<string, unknown>): Promise<OwnerOnboardingRecord> { const { data, error } = await supabaseServer.from("clinic_owner_onboarding").update(updates).eq("id", id).select(ONBOARDING_COLUMNS).single(); if (error || !data) throw new OwnerOnboardingError("Unable to update owner onboarding status."); return data as OwnerOnboardingRecord; }
function activationCallbackUrl(next: "/set-password" | "/reset-password"): string { const origin = process.env.NEXT_PUBLIC_APP_URL; if (!origin || !/^https:\/\//.test(origin)) throw new OwnerOnboardingError("NEXT_PUBLIC_APP_URL must be a valid HTTPS URL before sending owner activation."); return new URL(`/auth/callback?next=${next}`, origin).toString(); }
