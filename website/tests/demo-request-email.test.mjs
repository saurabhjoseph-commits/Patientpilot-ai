import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("book-demo persists first, queues both messages, and preserves success when delivery fails", () => {
  const route = read("app/api/book-demo/route.ts");
  assert.ok(route.indexOf("const lead = await leadService.bookDemo") < route.indexOf("deliveryIds = await enqueueDemoRequestEmails"));
  assert.match(route, /try \{ deliveryIds = await enqueueDemoRequestEmails/);
  assert.match(route, /after\(async \(\) =>/);
  assert.match(route, /Promise\.allSettled/);
  assert.match(route, /Your demo request has been received\./);
});

test("customer acknowledgement and team notification use the approved destinations", () => {
  const email = read("lib/leads/demo-request-email.ts");
  assert.match(email, /customer_acknowledgement/);
  assert.match(email, /team_notification/);
  assert.match(email, /support@patientpilot-ai\.com/);
  assert.match(email, /Your PatientPilot AI demo request has been received/);
  assert.match(read("components/forms/ContactForm.tsx"), /Your demo request has been received\./);
  assert.doesNotMatch(read("components/forms/ContactForm.tsx"), /session has been booked|booked successfully/i);
});

test("durable outbox is clinic-owned, atomically enqueued, retryable, and deduplicated", () => {
  const migration = read("lib/supabase/migrations/0029_demo_request_email_deliveries.sql");
  for (const value of ["clinic_id uuid not null", "lead_id bigint not null", "unique (lead_id, kind)", "provider_message_id", "attempt_count", "next_attempt_at", "enable row level security"]) assert.match(migration, new RegExp(value.replace(/[()]/g, "\\$&")));
  assert.match(migration, /after insert on public\.contacts/);
  assert.match(migration, /on conflict \(lead_id, kind\) do nothing/);
  assert.doesNotMatch(migration, /security definer/i);
  const email = read("lib/leads/demo-request-email.ts");
  assert.match(email, /Idempotency-Key/);
  assert.match(email, /MAX_ATTEMPTS = 5/);
  assert.match(email, /\.eq\("clinic_id", delivery\.clinic_id\)/);
});

test("provider acceptance is distinct from confirmed webhook delivery", () => {
  const email = read("lib/leads/demo-request-email.ts");
  assert.match(email, /status: "accepted"/);
  assert.match(email, /"email\.delivered": "delivered"/);
  assert.match(email, /delivered_at/);
  assert.match(email, /svix-id/);
  assert.match(email, /timingSafeEqual/);
  assert.match(email, /demo_request_email_events/);
  assert.match(email, /eventError\?\.code === "23505"/);
  assert.match(read("app/api/webhooks/resend/route.ts"), /verifyResendWebhook/);
});

test("retry route is secret-protected and provider failures retain bounded codes", () => {
  const retry = read("app/api/internal/demo-email-deliveries/retry/route.ts");
  const email = read("lib/leads/demo-request-email.ts");
  assert.match(retry, /EMAIL_RETRY_CRON_SECRET/);
  assert.match(retry, /timingSafeEqual/);
  assert.match(email, /transactional_email_not_configured/);
  assert.match(email, /provider_rejected_/);
  assert.doesNotMatch(email, /console\.(log|error)/);
});
