import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Agent 4 India onboarding reaches review and persists trusted AI emergency settings", () => {
  const wizard = read("app/admin/clinics/new/NewClinicWizard.tsx");
  const contract = read("lib/clinic/onboarding-contract.ts");
  const route = read("app/api/admin/clinics/route.ts");
  const rpc = read("lib/supabase/migrations/0027_agent4_clinic_onboarding_emergency_settings.sql");
  assert.match(wizard, /step < steps\.length - 1/);
  assert.match(wizard, /Step \{step \+ 1\} of \{steps\.length\}/);
  assert.match(wizard, /emergencyPhone: contact\.emergencyPhone/);
  assert.match(contract, /bilingual-auto/);
  assert.match(contract, /Asia\/Kolkata/);
  assert.match(contract, /currency: "INR"/);
  assert.match(contract, /escalation phone is required/i);
  assert.match(route, /p_emergency_rules/);
  assert.match(route, /afterHoursMode/);
  assert.match(rpc, /emergency_rules/);
  assert.match(rpc, /security definer/);
});

test("Agent 4 supports intentional bilingual conversion and existing operational lifecycle routes", () => {
  const edit = read("components/admin/ClinicEditForm.tsx");
  const update = read("app/api/admin/clinics/[id]/route.ts");
  const services = read("app/api/admin/services/route.ts");
  const doctors = read("app/api/admin/doctors/route.ts");
  const readiness = read("lib/clinic/operational-readiness.ts");
  assert.match(edit, /Bilingual Auto/);
  assert.match(edit, /Existing English clinics remain unchanged until this form is saved/);
  assert.match(update, /parseAISettings/);
  assert.match(update, /normalizeClinicLanguageMode/);
  assert.match(update, /emergency_rules/);
  assert.match(services, /default_duration_minutes/);
  assert.match(doctors, /resolveDoctorClinic/);
  for (const item of ["services", "doctors", "schedules", "doctor-services", "rooms", "room-assignments"]) {
    assert.match(readiness, new RegExp(`item\\("${item}"`));
  }
});

test("Agent 4 AI form presents the India bilingual default and compatible voice option", () => {
  const form = read("components/admin/clinic/ClinicAISettingsForm.tsx");
  assert.match(form, /value="bilingual-auto"/);
  assert.match(form, /value="alloy"/);
  assert.match(form, /Forward Emergency Calls/);
  assert.match(form, /Human Handoff/);
});
