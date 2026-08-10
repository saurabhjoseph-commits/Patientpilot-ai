import "server-only";

import { supabaseServer } from "@/lib/supabase-server";

export interface ClinicDeletionRecipient { readonly clinicName: string; readonly ownerName: string | null; readonly ownerEmail: string | null; }
export interface ClinicDeletionNotification { readonly id: string; readonly clinic_name: string; readonly owner_name: string | null; readonly owner_email: string; readonly status: "pending" | "sent" | "failed"; readonly attempt_count: number; }

const SUBJECT = "Your PatientPilot AI Clinic Account Has Been Deleted";

export function clinicDeletionEmail(recipient: ClinicDeletionRecipient): { subject: string; html: string; text: string } {
  const name = recipient.ownerName?.trim() || "there"; const clinic = escapeHtml(recipient.clinicName);
  const text = `Hello ${name},\n\nThis is to confirm that the PatientPilot AI account for:\n\n${recipient.clinicName}\n\nhas been permanently deleted by a PatientPilot AI administrator.\n\nYou will no longer be able to access this clinic dashboard or its administrative features.\n\nIf you believe this was done in error, please contact:\n\nsupport@patientpilotai.com\n\nRegards,\nPatientPilot AI`;
  return { subject: SUBJECT, text, html: `<p>Hello ${escapeHtml(name)},</p><p>This is to confirm that the PatientPilot AI account for:</p><p><strong>${clinic}</strong></p><p>has been permanently deleted by a PatientPilot AI administrator.</p><p>You will no longer be able to access this clinic dashboard or its administrative features.</p><p>If you believe this was done in error, please contact:<br><a href="mailto:support@patientpilotai.com">support@patientpilotai.com</a></p><p>Regards,<br>PatientPilot AI</p>` };
}

export async function sendClinicDeletionEmail(recipient: ClinicDeletionRecipient): Promise<{ success: boolean; failureCode?: string }> {
  if (!recipient.ownerEmail) return { success: false, failureCode: "owner_email_missing" };
  const apiKey = process.env.RESEND_API_KEY; const from = process.env.TRANSACTIONAL_EMAIL_FROM;
  if (!apiKey || !from) return { success: false, failureCode: "transactional_email_not_configured" };
  const message = clinicDeletionEmail(recipient);
  try {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [recipient.ownerEmail], subject: message.subject, html: message.html, text: message.text }) });
    return response.ok ? { success: true } : { success: false, failureCode: "provider_delivery_failed" };
  } catch { return { success: false, failureCode: "provider_unavailable" }; }
}

export async function captureClinicDeletionRecipient(clinicId: string, clinicName: string): Promise<ClinicDeletionRecipient> {
  const { data: onboarding, error } = await supabaseServer.from("clinic_owner_onboarding").select("auth_user_id,owner_email,owner_full_name").eq("clinic_id", clinicId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error("Unable to resolve the clinic owner before deletion.");
  if (onboarding?.owner_email) return { clinicName, ownerName: onboarding.owner_full_name ? String(onboarding.owner_full_name) : null, ownerEmail: String(onboarding.owner_email) };
  const { data: profile, error: profileError } = await supabaseServer.from("profiles").select("id,full_name").eq("clinic_id", clinicId).in("role", ["owner", "manager", "administrator"]).limit(1).maybeSingle();
  if (profileError) throw new Error("Unable to resolve the clinic administrator before deletion.");
  if (!profile) return { clinicName, ownerName: null, ownerEmail: null };
  const { data, error: authError } = await supabaseServer.auth.admin.getUserById(String(profile.id));
  if (authError || !data.user?.email) return { clinicName, ownerName: profile.full_name ? String(profile.full_name) : null, ownerEmail: null };
  return { clinicName, ownerName: profile.full_name ? String(profile.full_name) : null, ownerEmail: data.user.email };
}

export async function createDeletionNotification(recipient: ClinicDeletionRecipient): Promise<ClinicDeletionNotification | null> {
  if (!recipient.ownerEmail) return null;
  const { data, error } = await supabaseServer.from("clinic_deletion_notifications").insert({ clinic_name: recipient.clinicName, owner_name: recipient.ownerName, owner_email: recipient.ownerEmail, status: "pending", attempt_count: 0 }).select("id,clinic_name,owner_name,owner_email,status,attempt_count").single();
  if (error || !data) return null;
  return data as ClinicDeletionNotification;
}

export async function deliverDeletionNotification(notification: ClinicDeletionNotification): Promise<boolean> {
  const result = await sendClinicDeletionEmail({ clinicName: notification.clinic_name, ownerName: notification.owner_name, ownerEmail: notification.owner_email });
  const update = result.success
    ? { status: "sent", sent_at: new Date().toISOString(), attempt_count: notification.attempt_count + 1, failure_code: null }
    : { status: "failed", attempt_count: notification.attempt_count + 1, failure_code: result.failureCode?.slice(0, 100) ?? "delivery_failed" };
  const { error } = await supabaseServer.from("clinic_deletion_notifications").update(update).eq("id", notification.id);
  return result.success && !error;
}

function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }
