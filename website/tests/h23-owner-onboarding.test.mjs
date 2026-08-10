import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("clinic owner onboarding uses a distinct owner identity and server-only Auth invitation", () => {
  const wizard = read("app/admin/clinics/new/NewClinicWizard.tsx");
  const route = read("app/api/admin/clinics/route.ts");
  const onboarding = read("lib/clinic/owner-onboarding.ts");
  assert.match(wizard, /ClinicOwnerAccountForm/);
  assert.match(wizard, /ownerAccount/);
  assert.match(route, /assertOwnerOnboardingReady/);
  assert.match(route, /startOwnerOnboarding/);
  assert.match(onboarding, /auth\.admin\.inviteUserByEmail/);
  assert.match(onboarding, /clinic_owner_onboarding/);
  assert.match(onboarding, /profiles/);
  assert.match(onboarding, /clinic_id: record\.clinic_id/);
  assert.doesNotMatch(onboarding, /console\./);
});

test("onboarding persists only approved safe metadata and uses the configured Supabase invite delivery", () => {
  const onboarding = read("lib/clinic/owner-onboarding.ts");
  assert.match(onboarding, /owner_email/);
  assert.match(onboarding, /owner_full_name/);
  assert.match(onboarding, /auth_user_id/);
  assert.match(onboarding, /invitation_sent_at/);
  assert.match(onboarding, /invitation_failed/);
  assert.doesNotMatch(onboarding, /temporary_password|temporaryPassword|console\./);
});

test("existing Auth collisions fail closed and failure does not claim onboarding success", () => {
  const onboarding = read("lib/clinic/owner-onboarding.ts");
  const route = read("app/api/admin/clinics/route.ts");
  assert.match(onboarding, /already belongs to an Auth account/);
  assert.match(onboarding, /status: "failed"/);
  assert.match(route, /status: partial \? 202 : 201/);
  assert.match(onboarding, /profile_conflict/);
  assert.match(onboarding, /profile_setup_failed/);
});

test("owner activation verifies only allowed token flows and marks a matching profile active", () => {
  const callback = read("app/auth/callback/route.ts");
  const activation = read("app/api/auth/complete-owner-activation/route.ts");
  const completion = read("lib/clinic/owner-onboarding.ts");
  assert.match(callback, /next === "\/set-password"/);
  assert.match(callback, /type: invitation \? "invite" : "recovery"/);
  assert.match(activation, /supabaseServer\.auth\.getUser\(accessToken\)/);
  assert.match(completion, /profile\.clinic_id !== record\.clinic_id/);
  assert.match(completion, /status: "active"/);
});

test("tenant-scoped owner dashboard and global super-admin behavior remain server derived", () => {
  const auth = read("lib/auth-server.ts");
  const context = read("lib/doctors/clinic-context.ts");
  const dashboard = read("app/admin/page.tsx");
  assert.match(auth, /profile\.clinic_id/);
  assert.match(auth, /roleMap/);
  assert.match(context, /Cross-clinic doctor access is not permitted/);
  assert.match(context, /DoctorsManageGlobal/);
  assert.match(dashboard, /identity\.clinicId/);
  assert.match(dashboard, /Open clinic setup/);
});

test("owners with an outstanding onboarding record cannot bypass the first-password-change gate", () => {
  const proxy = read("proxy.ts");
  const adapter = read("lib/infrastructure/identity/SupabaseAuthCompatibilityAdapter.ts");
  const layout = read("app/admin/layout.tsx");
  assert.match(adapter, /requiresOwnerPasswordChange/);
  assert.match(proxy, /requiresPasswordChange/);
  assert.match(proxy, /Password change required/);
  assert.match(layout, /redirect\("\/set-password"\)/);
});

test("existing clinics can start one owner onboarding record without a backfill", () => {
  const card = read("components/admin/OwnerOnboardingCard.tsx");
  const setup = read("app/api/admin/clinics/[id]/owner-onboarding/setup/route.ts");
  assert.match(card, /Set Up Owner Account/);
  assert.match(setup, /startOwnerOnboarding/);
  assert.match(setup, /assertOwnerOnboardingReady/);
  assert.match(setup, /Permissions\.ClinicUpdate/);
});
