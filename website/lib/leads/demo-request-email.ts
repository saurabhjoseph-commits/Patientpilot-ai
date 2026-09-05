import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseServer } from "@/lib/supabase-server";
import type { Lead } from "./types";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";

export type DemoEmailKind = "customer_acknowledgement" | "team_notification";
type Delivery = { id: string; clinic_id: string; lead_id: number; kind: DemoEmailKind; recipient_email: string; status: string; attempt_count: number };
const TEAM_EMAIL = "support@patientpilot-ai.com";
const MAX_ATTEMPTS = 5;

export async function enqueueDemoRequestEmails(lead: Lead, scope: ClinicScope): Promise<readonly string[]> {
  const rows = [
    { clinic_id: scope.clinicId, lead_id: lead.id, kind: "customer_acknowledgement", recipient_email: lead.email },
    { clinic_id: scope.clinicId, lead_id: lead.id, kind: "team_notification", recipient_email: TEAM_EMAIL },
  ] satisfies readonly Record<string, unknown>[];
  const { data, error } = await supabaseServer.from("demo_request_email_deliveries").upsert(rows, { onConflict: "lead_id,kind" }).select("id");
  if (error) throw new Error("Unable to queue demo-request email delivery.");
  return (data ?? []).map((row) => String(row.id));
}

export async function deliverDemoRequestEmail(id: string): Promise<"accepted" | "failed" | "skipped"> {
  const now = new Date().toISOString();
  const { data: claimed } = await supabaseServer.from("demo_request_email_deliveries")
    .update({ status: "sending", last_attempt_at: now, updated_at: now })
    .eq("id", id).in("status", ["pending", "failed"]).lt("attempt_count", MAX_ATTEMPTS).lte("next_attempt_at", now)
    .select("id,clinic_id,lead_id,kind,recipient_email,status,attempt_count").maybeSingle();
  if (!claimed) return "skipped";
  const delivery = claimed as Delivery;
  const { data: lead, error } = await supabaseServer.from("contacts").select("id,clinic_id,clinic_name,dentist_name,email,phone,monthly_calls,message").eq("id", delivery.lead_id).eq("clinic_id", delivery.clinic_id).maybeSingle();
  if (error || !lead) return fail(delivery, "lead_not_found");
  const result = await sendViaResend(delivery, lead as Record<string, unknown>);
  if (!result.accepted) return fail(delivery, result.failureCode);
  const acceptedAt = new Date().toISOString();
  const { error: updateError } = await supabaseServer.from("demo_request_email_deliveries").update({ status: "accepted", provider_message_id: result.providerMessageId, accepted_at: acceptedAt, attempt_count: delivery.attempt_count + 1, failure_code: null, updated_at: acceptedAt }).eq("id", delivery.id).eq("clinic_id", delivery.clinic_id).eq("status", "sending");
  return updateError ? "failed" : "accepted";
}

export async function retryDueDemoRequestEmails(): Promise<{ attempted: number; accepted: number }> {
  const { data, error } = await supabaseServer.from("demo_request_email_deliveries").select("id").in("status", ["pending", "failed"]).lt("attempt_count", MAX_ATTEMPTS).lte("next_attempt_at", new Date().toISOString()).order("next_attempt_at").limit(25);
  if (error) throw new Error("Unable to load due demo-request emails.");
  let accepted = 0;
  for (const row of data ?? []) if (await deliverDemoRequestEmail(String(row.id)) === "accepted") accepted += 1;
  return { attempted: data?.length ?? 0, accepted };
}

export function verifyResendWebhook(rawBody: string, headers: Headers, secret: string, now = Date.now()): boolean {
  const id = headers.get("svix-id"); const timestamp = headers.get("svix-timestamp"); const signature = headers.get("svix-signature");
  if (!id || !timestamp || !signature || !/^\d+$/.test(timestamp) || Math.abs(now - Number(timestamp) * 1000) > 300_000) return false;
  const key = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest();
  return signature.split(" ").some((item) => { const [version, encoded] = item.split(","); if (version !== "v1" || !encoded) return false; const actual = Buffer.from(encoded, "base64"); return actual.length === expected.length && timingSafeEqual(actual, expected); });
}

export async function recordResendDeliveryEvent(providerEventId: string, event: Record<string, unknown>): Promise<void> {
  const type = typeof event.type === "string" ? event.type : "";
  const { error: eventError } = await supabaseServer.from("demo_request_email_events").insert({ provider_event_id: providerEventId, event_type: type || "unknown" });
  if (eventError?.code === "23505") return;
  if (eventError) throw new Error("Unable to claim email delivery event.");
  const data = event.data && typeof event.data === "object" ? event.data as Record<string, unknown> : {};
  const providerId = typeof data.email_id === "string" ? data.email_id : typeof data.id === "string" ? data.id : null;
  const states: Record<string, string> = { "email.delivered": "delivered", "email.bounced": "bounced", "email.complained": "complained", "email.suppressed": "suppressed" };
  const status = states[type]; if (!providerId || !status) return;
  const at = new Date().toISOString();
  const update: Record<string, unknown> = { status, updated_at: at };
  if (status === "delivered") update.delivered_at = at;
  const { error } = await supabaseServer.from("demo_request_email_deliveries").update(update).eq("provider_message_id", providerId).eq("status", "accepted");
  if (error) throw new Error("Unable to record email delivery event.");
}

async function sendViaResend(delivery: Delivery, lead: Record<string, unknown>): Promise<{ accepted: true; providerMessageId: string } | { accepted: false; failureCode: string }> {
  const apiKey = process.env.RESEND_API_KEY; const from = process.env.TRANSACTIONAL_EMAIL_FROM;
  if (!apiKey || !from) return { accepted: false, failureCode: "transactional_email_not_configured" };
  const message = buildMessage(delivery.kind, lead);
  try {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `demo-request-${delivery.lead_id}-${delivery.kind}` }, body: JSON.stringify({ from, to: [delivery.recipient_email], reply_to: String(lead.email), subject: message.subject, html: message.html, text: message.text }) });
    const body = await response.json().catch(() => ({})) as Record<string, unknown>;
    return response.ok && typeof body.id === "string" ? { accepted: true, providerMessageId: body.id } : { accepted: false, failureCode: response.ok ? "provider_id_missing" : `provider_rejected_${response.status}` };
  } catch { return { accepted: false, failureCode: "provider_unavailable" }; }
}

async function fail(delivery: Delivery, failureCode: string): Promise<"failed"> {
  const attempts = delivery.attempt_count + 1; const now = new Date(); const retryAt = new Date(now.getTime() + Math.min(2 ** attempts * 60_000, 3_600_000)).toISOString();
  await supabaseServer.from("demo_request_email_deliveries").update({ status: "failed", attempt_count: attempts, failure_code: failureCode.slice(0, 100), next_attempt_at: retryAt, updated_at: now.toISOString() }).eq("id", delivery.id).eq("clinic_id", delivery.clinic_id).eq("status", "sending");
  return "failed";
}

function buildMessage(kind: DemoEmailKind, lead: Record<string, unknown>) {
  const name = String(lead.dentist_name); const clinic = String(lead.clinic_name);
  if (kind === "customer_acknowledgement") { const text = `Hello ${name},\n\nYour PatientPilot AI demo request for ${clinic} has been received. Our team will contact you within 24 hours.\n\nRegards,\nPatientPilot AI`; return { subject: "Your PatientPilot AI demo request has been received", text, html: `<p>Hello ${escapeHtml(name)},</p><p>Your PatientPilot AI demo request for <strong>${escapeHtml(clinic)}</strong> has been received.</p><p>Our team will contact you within 24 hours.</p><p>Regards,<br>PatientPilot AI</p>` }; }
  const text = `New demo request\n\nName: ${name}\nPractice: ${clinic}\nEmail: ${String(lead.email)}\nPhone: ${String(lead.phone)}\nMonthly calls: ${String(lead.monthly_calls ?? "")}`;
  return { subject: `New demo request: ${clinic}`, text, html: `<h1>New demo request</h1><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Practice:</strong> ${escapeHtml(clinic)}<br><strong>Email:</strong> ${escapeHtml(String(lead.email))}<br><strong>Phone:</strong> ${escapeHtml(String(lead.phone))}<br><strong>Monthly calls:</strong> ${escapeHtml(String(lead.monthly_calls ?? ""))}</p>` };
}

function escapeHtml(value: string): string { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }
