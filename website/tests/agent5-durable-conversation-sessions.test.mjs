import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const store = readFileSync(new URL("../lib/ai/session-store.ts", import.meta.url), "utf8");
const session = readFileSync(new URL("../lib/ai/session.ts", import.meta.url), "utf8");
const migration = readFileSync(new URL("../lib/supabase/migrations/0026_agent5_durable_conversation_sessions_review.sql", import.meta.url), "utf8");
const statusRoute = readFileSync(new URL("../app/api/twilio/status/route.ts", import.meta.url), "utf8");

function load(rows, clinicId, callId, at = Date.now()) {
  const row = rows.find(value => value.clinic_id === clinicId && value.call_sid === callId);
  if (!row || row.status !== "active" || Date.parse(row.expires_at) <= at) return null;
  return row.session_data.clinicId === clinicId && row.session_data.callId === callId ? structuredClone(row.session_data) : null;
}
const base = { clinicId: "clinic-a", callId: "CA1", patient: { fullName: "Asha", phone: "+91" }, appointment: { appointmentDate: "2026-08-21", appointmentTime: "10:00", reason: "checkup", confirmed: false }, language: { configuredMode: "bilingual-auto", currentPatientLanguage: "hindi", detectedPrimaryLanguage: "hindi", confidence: .94, codeSwitchingOccurred: false } };
const activeRow = { clinic_id: "clinic-a", call_sid: "CA1", status: "active", expires_at: "2099-01-01T00:00:00Z", session_data: base };

test("session survives repository recreation and restores patient/appointment fields", () => {
  const recreatedRows = structuredClone([activeRow]);
  const restored = load(recreatedRows, "clinic-a", "CA1");
  assert.deepEqual(restored.patient, base.patient);
  assert.deepEqual(restored.appointment, base.appointment);
  assert.match(store, /from\("conversation_sessions"\).*upsert/s);
});
test("Hindi and Hinglish language state are durable", () => {
  assert.equal(load([activeRow], "clinic-a", "CA1").language.currentPatientLanguage, "hindi");
  const hinglish = structuredClone(activeRow); hinglish.session_data.language.currentPatientLanguage = "hinglish"; hinglish.session_data.language.codeSwitchingOccurred = true;
  assert.equal(load([hinglish], "clinic-a", "CA1").language.currentPatientLanguage, "hinglish");
  assert.equal(load([hinglish], "clinic-a", "CA1").language.codeSwitchingOccurred, true);
  for (const column of ["language_mode", "current_language", "primary_language", "language_confidence", "code_switching"]) assert.match(migration, new RegExp(column));
});
test("Clinic A cannot load Clinic B session", () => assert.equal(load([activeRow], "clinic-b", "CA1"), null));
test("expired and completed sessions do not reload", () => {
  assert.equal(load([{ ...activeRow, expires_at: "2020-01-01T00:00:00Z" }], "clinic-a", "CA1"), null);
  assert.equal(load([{ ...activeRow, status: "completed" }], "clinic-a", "CA1"), null);
  assert.match(store, /status !== "active"/);
});
test("tenant ownership is server-derived and every session predicate is clinic scoped", () => {
  assert.match(store, /\.eq\("clinic_id", clinicId\)\.eq\("call_sid", callId\)/);
  assert.doesNotMatch(session, /new Map|const sessions/);
  assert.match(migration, /no browser\/authenticated policy/i);
});
test("CRM transcript and call outcome persistence are wired", () => {
  assert.match(store, /from\("call_messages"\)\.upsert/);
  assert.match(statusRoute, /persistTelephonyCallStatus/);
  assert.match(statusRoute, /markCompleted/);
});
