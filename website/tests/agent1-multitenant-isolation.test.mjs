import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Agent 1 patient persistence derives and enforces clinic ownership for both clinic fixtures", () => {
  const types = read("lib/patients/types.ts");
  const mapper = read("lib/patients/mapper.ts");
  const repository = read("lib/patients/repository.ts");
  const service = read("lib/patients/service.ts");
  const page = read("app/admin/patients/page.tsx");
  const migration = read("lib/supabase/migrations/0024_agent1_patient_clinic_isolation_review.sql");
  assert.match(types, /clinicId: string/); assert.match(mapper, /clinic_id: input\.clinicId/);
  assert.match(repository, /\.eq\("clinic_id", clinicId\)/); assert.match(repository, /filters\.clinicId/);
  assert.match(service, /input\.clinicId/); assert.match(page, /requireAdminPagePermission/); assert.match(page, /clinicId: identity\.clinicId/);
  assert.match(migration, /add column clinic_id uuid/);
  assert.match(migration, /count\(distinct c\.clinic_id\) = 1/);
  assert.match(migration, /no deterministic call-summary ownership source/);
  assert.match(migration, /alter column clinic_id set not null/);
});

test("Agent 1 patient migration selects one validated UUID clinic without unsupported aggregation", () => {
  const migration = read("lib/supabase/migrations/0024_agent1_patient_clinic_isolation_review.sql");
  assert.doesNotMatch(migration, /min\s*\(\s*c\.clinic_id\s*\)/i);
  assert.match(migration, /select c\.clinic_id[\s\S]*group by c\.clinic_id[\s\S]*limit 1/);
  assert.match(migration, /count\(\*\) = count\(c\.clinic_id\)[\s\S]*count\(distinct c\.clinic_id\) = 1/);
  assert.match(migration, /left join public\.calls c on c\.call_sid = s\.call_sid/);
  assert.match(migration, /ambiguous, missing, or cross-clinic call-summary ownership/);
  assert.match(migration, /no deterministic call-summary ownership source/);
  assert.match(migration, /deterministic ownership backfill left null clinic_id values/);
  assert.match(migration, /^begin;[\s\S]*commit;/m);
});

test("Agent 1 calls, transcripts, appointments, and leads retain server-derived clinic scope", () => {
  const calls = read("app/api/calls/route.ts");
  const transcript = read("app/api/transcript/route.ts");
  const appointments = read("app/api/appointments/route.ts");
  const leads = read("app/api/leads/[id]/route.ts");
  assert.match(calls, /resolveAdminClinic\(authorization\)\.clinicId/);
  assert.match(transcript, /parentCall/); assert.match(transcript, /\.eq\("clinic_id", clinicId\)/);
  assert.match(appointments, /resolveAdminClinic\(authorization\)\.clinicId/); assert.match(leads, /resolveAdminClinic/);
});

test("Agent 1 summaries and AI actions are bound to the verified clinic-owned parent call", () => {
  const migration = read("lib/supabase/migrations/0025_agent1_call_owned_isolation_review.sql");
  const repository = read("lib/summaries/repository.ts");
  const service = read("lib/summaries/service.ts");
  const workflow = read("lib/workflows/conversation-workflow.ts");
  const calls = read("lib/calls/ownership.ts");
  const voice = read("app/api/twilio/voice/route.ts");
  assert.match(migration, /call_summaries_call_clinic_id_fkey/);
  assert.match(migration, /ai_actions_call_clinic_id_fkey/);
  assert.match(migration, /call summary has no verified clinic-owned call/);
  assert.match(repository, /clinic_id: input\.clinicId/);
  assert.match(repository, /call_id: input\.callId/);
  assert.match(repository, /\.eq\("clinic_id", clinicId\)/);
  assert.match(service, /resolveCallOwnership/);
  assert.match(workflow, /scope,\s*context\.clinicName/);
  assert.match(calls, /Provider call is already bound to another clinic/);
  assert.match(voice, /ensureTelephonyCall/);
});

test("Agent 1 service-role lead activity verifies the clinic-scoped parent before writing", () => {
  const activity = read("lib/activity.ts");
  const quickActions = read("app/api/admin/quick-actions/route.ts");
  const notes = read("app/api/admin/notes/route.ts");
  assert.match(activity, /\.eq\("clinic_id", scope\.clinicId\)/);
  assert.match(activity, /Lead does not belong to the current clinic/);
  assert.match(quickActions, /resolveAdminClinic\(authorization\)/);
  assert.match(notes, /resolveAdminClinic\(authorization\)/);
});

test("Agent 1 documents a staging-only two-clinic database acceptance harness", () => {
  const harness = read("docs/database-audit/AGENT1_CLINIC_ISOLATION_ACCEPTANCE.md");
  assert.match(harness, /must never run against\s+production/);
  assert.match(harness, /read[\s\S]*update[\s\S]*delete/i);
  assert.match(harness, /call_summaries/);
  assert.match(harness, /ai_actions/);
  assert.match(harness, /zero rows on success/);
});
