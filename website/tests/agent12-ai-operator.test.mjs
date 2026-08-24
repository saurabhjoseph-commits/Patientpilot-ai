import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { AdminE2EHarness, assertExecutionSafety } from "./fixtures/agent12-admin-e2e-harness.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("ai_operator maps to a distinct least-privilege role", () => {
  const roles = read("lib/auth/profile-role-policy.ts");
  const operator = read("lib/auth/ai-operator-policy.ts");
  const catalog = read("lib/platform/domain/identity/permission-catalog.ts");
  assert.match(roles, /AI_OPERATOR_PROFILE_ROLE/);
  assert.match(operator, /AI_OPERATOR_PROFILE_ROLE = "ai_operator"/);
  const policy = catalog.match(/"ai-operator": \[([^\]]+)\]/)?.[1] ?? "";
  for (const denied of ["BillingManage", "UsersManageRoles", "DoctorsManageGlobal", "DoctorsDelete", "ClinicUpdate", "PatientsDelete", "LeadsDelete"]) assert.doesNotMatch(policy, new RegExp(denied));
  for (const allowed of ["DashboardRead", "ClinicRead", "LeadsRead", "PatientsRead", "AppointmentsRead", "CallsRead", "AnalyticsRead", "SettingsRead"]) assert.match(policy, new RegExp(allowed));
  assert.match(catalog, /allPermissions[\s\S]*filter\(\(permission\) => !operatorOnlyPermissions\.has\(permission\)\)/);
});

test("staging-global and write permissions require a trusted server environment guard", () => {
  const policy = read("lib/auth/ai-operator-policy.ts");
  assert.match(policy, /AI_OPERATOR_STAGING_GLOBAL_ENABLED === "true"/);
  assert.match(policy, /VERCEL_ENV !== "production"/);
  assert.match(policy, /roleCode !== AI_OPERATOR_ROLE_CODE/);
  assert.match(policy, /StagingGlobalTestRead/);
});

test("production is permanently read-only and production hosts reject writes", () => {
  assert.doesNotThrow(() => assertExecutionSafety({ target: "production", baseUrl: "https://www.patientpilot-ai.com", writesRequested: false, allowStagingWrites: false }));
  assert.throws(() => assertExecutionSafety({ target: "production", baseUrl: "https://www.patientpilot-ai.com", writesRequested: true, allowStagingWrites: true }), /production host/);
  assert.throws(() => assertExecutionSafety({ target: "production", baseUrl: "https://preview.example", writesRequested: true, allowStagingWrites: true }), /read-only/);
});

test("Clinic A and B remain isolated for patients, appointments, calls, and messages", () => {
  const harness = new AdminE2EHarness();
  const ownerA = { clinicId: "clinic-a", stagingGlobal: false };
  for (const table of ["patients", "appointments", "calls", "messages"]) {
    harness.seed(table, { id: `${table}-a`, clinicId: "clinic-a" });
    harness.seed(table, { id: `${table}-b`, clinicId: "clinic-b" });
    assert.deepEqual(harness.list(table, ownerA).map((row) => row.id), [`${table}-a`]);
    assert.throws(() => harness.list(table, ownerA, "clinic-b"), /cross-clinic denied/);
    assert.throws(() => harness.get(table, `${table}-b`, ownerA), /record denied/);
  }
});

test("staging operator may inspect both clinics but mutate and clean only tagged test rows", () => {
  const harness = new AdminE2EHarness();
  const operator = { clinicId: "clinic-a", stagingGlobal: true };
  harness.seed("patients", { id: "real-b", clinicId: "clinic-b", isTest: false });
  assert.equal(harness.list("patients", operator, "clinic-b").length, 1);
  assert.throws(() => harness.createSynthetic("patients", operator, { id: "bad", clinicId: "clinic-b", isTest: false }), /synthetic write denied/);
  const row = harness.createSynthetic("patients", operator, { id: "test-b", clinicId: "clinic-b", isTest: true, source: "agent12-e2e" });
  assert.throws(() => harness.cleanup("patients", operator, "real-b"), /cleanup denied/);
  harness.cleanup("patients", operator, row.id);
  assert.equal(harness.list("patients", operator, "clinic-b").length, 1);
});

test("review migration adds only role validation and explicit test markers without RLS bypass", () => {
  const migration = read("lib/supabase/migrations/0028_agent12_ai_operator_test_data_review.sql");
  assert.match(migration, /^begin;[\s\S]*commit;/m);
  assert.match(migration, /'ai_operator'::text/);
  for (const table of ["clinics", "leads", "patients", "appointments"]) assert.match(migration, new RegExp(`alter table public\\.${table} add column is_test boolean not null default false`));
  assert.doesNotMatch(migration, /security definer|create policy|grant\s/i);
});

test("no credential or secret value is stored by the harness", () => {
  const docs = read("docs/AI_OPERATOR_ADMIN_E2E.md");
  assert.doesNotMatch(docs, /service_role\s*=|password\s*=|sk-[a-z0-9]/i);
  assert.match(docs, /Never store the password/);
});
