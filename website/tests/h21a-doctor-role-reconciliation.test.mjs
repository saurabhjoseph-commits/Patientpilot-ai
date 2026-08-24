import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("H2.1A preserves legacy dentist while adding canonical doctor role", () => {
  const migration = read("lib/supabase/migrations/0020a_h21_doctor_profile_role_reconciliation.sql");
  assert.match(migration, /conname = 'profiles_role_check'/);
  assert.match(migration, /expected_definition/);
  assert.match(migration, /'dentist'::text, 'doctor'::text/);
  assert.match(migration, /Rollback blocked: doctor profiles exist/);
  assert.doesNotMatch(migration, /update public\.profiles/i);
  assert.doesNotMatch(migration, /create policy/i);
});

test("doctor and dentist use the same fail-closed application role mapping", () => {
  const policy = read("lib/auth/profile-role-policy.ts");
  assert.match(policy, /dentist: "dentist"/);
  assert.match(policy, /doctor: "dentist"/);
  for (const path of ["lib/auth-server.ts", "lib/infrastructure/identity/SupabaseAuthCompatibilityAdapter.ts"]) assert.match(read(path), /resolveProfileRolePolicy/);
});

test("doctor identity resolver requires one active same-clinic linked record", () => {
  const resolver = read("lib/doctors/identity-resolver.ts");
  assert.match(resolver, /profile\.role !== "doctor" && profile\.role !== "dentist"/);
  assert.match(resolver, /\.eq\("auth_user_id", authUserId\)\.eq\("clinic_id", profile\.clinic_id\)\.eq\("status", "active"\)/);
  assert.match(resolver, /doctors\.length !== 1/);
});
