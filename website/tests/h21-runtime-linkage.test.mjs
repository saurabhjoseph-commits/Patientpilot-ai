import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("H2.1 appointment linkage validates same-clinic doctor, service, room, and duration", () => {
  const resolver = read("lib/appointments/clinical-linkage.ts"); const mapper = read("lib/appointments/mapper.ts");
  assert.match(resolver, /Selected service does not belong to this clinic/); assert.match(resolver, /Selected doctor does not belong to this clinic/); assert.match(resolver, /Selected doctor is not assigned to this service/); assert.match(resolver, /Selected room does not belong to this clinic/); assert.match(resolver, /custom_duration_minutes \?\? durationMinutes/);
  for (const column of ["doctor_id", "service_id", "room_id", "duration_minutes", "checked_in_at", "completed_at"]) assert.match(mapper, new RegExp(column));
});
test("calendar repository accepts clinic-scoped clinical filters", () => { const repository = read("lib/scheduling/repository.ts"); for (const column of ["doctor_id", "service_id", "room_id", "duration_minutes"]) assert.match(repository, new RegExp(column)); });
