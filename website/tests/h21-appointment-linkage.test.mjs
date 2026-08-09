import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(new URL("../lib/supabase/migrations/0020_h2_appointment_clinical_linkage.sql", import.meta.url), "utf8");

test("H2.1 linkage migration is review-only, clinic-scoped, and blocks an unverified doctor profile role", () => {
  for (const column of ["doctor_id uuid null", "service_id uuid null", "room_id uuid null", "duration_minutes integer null", "checked_in_at timestamptz null", "completed_at timestamptz null"]) assert.match(migration, new RegExp(column));
  assert.match(migration, /foreign key \(doctor_id, clinic_id\) references public\.doctors\(id, clinic_id\)/);
  assert.match(migration, /foreign key \(service_id, clinic_id\) references public\.clinic_services\(id, clinic_id\)/);
  assert.match(migration, /foreign key \(room_id, clinic_id\) references public\.clinic_rooms\(id, clinic_id\)/);
  assert.match(migration, /duration_minutes is null or duration_minutes > 0/);
  assert.match(migration, /completed_at is null or checked_in_at is null or completed_at >= checked_in_at/);
  assert.match(migration, /profiles\.role does not accept doctor/);
  assert.doesNotMatch(migration, /create policy/i);
});
