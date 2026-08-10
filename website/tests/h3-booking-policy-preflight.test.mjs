import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");

test("H3 booking-policy migration is review-only, fail-closed, and preserves existing clinics", () => {
  const migration = read("website/lib/supabase/migrations/0021_h3_clinic_booking_policy.sql");
  assert.match(migration, /begin;[\s\S]*do \$\$[\s\S]*clinic_settings[\s\S]*commit;/);
  for (const field of ["minimum_booking_notice_minutes", "maximum_booking_horizon_days", "slot_interval_minutes"]) assert.match(migration, new RegExp(`add column ${field} integer null`));
  assert.match(migration, /between 0 and 10080/);
  assert.match(migration, /between 1 and 730/);
  assert.match(migration, /between 5 and 240/);
  assert.match(migration, /mod\(slot_interval_minutes, 5\) = 0/);
  assert.doesNotMatch(migration, /update public\.clinic_settings|insert into public\.clinic_settings|default \d+/i);
  assert.doesNotMatch(migration, /create policy|to public/i);
});

test("H3 readiness audit fails closed and evaluates only non-sensitive clinic readiness", () => {
  const audit = read("docs/database-audit/H3_SCHEDULING_READINESS_AUDIT.sql");
  assert.match(audit, /H3 readiness audit blocked/);
  for (const table of ["clinic_settings", "clinic_services", "doctors", "doctor_services", "doctor_schedules", "doctor_leave", "blocked_time", "clinic_rooms", "doctor_room_assignments", "appointments"]) assert.match(audit, new RegExp(table));
  for (const column of ["clinic_id", "clinic_name", "timezone_present", "office_hours_present", "booking_policy_present", "minimum_booking_notice_minutes", "maximum_booking_horizon_days", "slot_interval_minutes", "active_services_count", "valid_service_duration_count", "active_doctors_count", "doctor_service_assignment_count", "doctor_schedules_count", "usable_schedule_count", "active_rooms_count", "active_doctor_room_assignment_count", "appointment_linkage_compatible", "h3_ready"]) assert.match(audit, new RegExp(column));
  assert.match(audit, /and booking_policy_present[\s\S]*and valid_service_duration_count > 0[\s\S]*and active_rooms_count > 0[\s\S]*and active_doctor_room_assignment_count > 0/);
  assert.doesNotMatch(audit, /a\.(patient_name|phone|email)|patient_name\s+as|phone\s+as|email\s+as/i);
});

test("booking-policy semantics retain duration authority and clinic isolation", () => {
  const document = read("docs/H3_BOOKING_POLICY_PREFLIGHT.md");
  assert.match(document, /clinic-local current time/);
  assert.match(document, /Slot interval.*not an appointment duration/is);
  assert.match(document, /doctor-service override, then clinic-service default/);
  assert.match(document, /no availability when a required clinic timezone/);
});
