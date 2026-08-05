import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("temporary Supabase Auth adapter fails closed and derives administrator clinic permissions", () => {
  const adapter = read("lib/infrastructure/identity/SupabaseAuthCompatibilityAdapter.ts");
  const sql = read("lib/supabase/migrations/0013_india_supabase_auth_profile_bootstrap.sql");
  assert.match(adapter, /auth\.getUser/);
  assert.match(adapter, /profiles/);
  assert.match(adapter, /if \(error \|\| !profile\?\.clinic_id \|\| !profile\.role\) return null/);
  assert.match(adapter, /super_admin: "super-admin"/);
  assert.match(adapter, /DefaultRolePolicies\[roleCode\]/);
  assert.match(sql, /Bootstrap auth user is missing/);
  assert.match(sql, /Bootstrap clinic is missing/);
  assert.match(sql, /different clinic or role/);
  assert.match(sql, /'super_admin'/);
  assert.doesNotMatch(sql, /user_credentials|password_hash/);
});
