import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("calendar exposes permission-gated new appointment and open appointment actions", () => {
  const page = read("app/admin/calendar/page.tsx");
  const card = read("components/admin/CalendarAppointmentCard.tsx");
  assert.match(page, /Permissions\.AppointmentsCreate/);
  assert.match(page, /href="\/admin\/appointments\/new"/);
  assert.match(card, /href=\{`\/admin\/appointments\/\$\{appointment\.id\}`\}/);
  assert.match(card, />Open</);
});

test("calendar cards reuse the authoritative lifecycle action component", () => {
  const card = read("components/admin/CalendarAppointmentCard.tsx");
  const lifecycle = read("components/admin/AppointmentLifecycleActions.tsx");
  assert.match(card, /AppointmentLifecycleActions/);
  assert.match(card, /compact canManage=\{canManage\}/);
  assert.match(lifecycle, /\/api\/appointments\/\$\{id\}/);
  assert.match(lifecycle, /\{checkedInAt && <Button label="Complete"/);
  assert.match(lifecycle, /\{!checkedInAt && <Button label="Check in"/);
  assert.match(lifecycle, /window\.confirm\("Cancel this appointment/);
});

test("calendar provides real desktop and mobile week renderers", () => {
  const page = read("app/admin/calendar/page.tsx");
  assert.match(page, /function WeekView/);
  assert.match(page, /md:grid-cols-7/);
  assert.match(page, /weekDays\(date\)/);
  assert.match(page, /Week date selector/);
  assert.match(page, /overflow-x-auto/);
  assert.match(page, /md:hidden/);
});

test("calendar provides month grid, selected-day agenda, and date navigation", () => {
  const page = read("app/admin/calendar/page.tsx");
  assert.match(page, /function MonthView/);
  assert.match(page, /grid-cols-7/);
  assert.match(page, /monthCells\(date\)/);
  assert.match(page, /view: "day"/);
  assert.match(page, /selectedDate/);
  assert.match(page, />Previous</);
  assert.match(page, />Next</);
  assert.match(page, />Today</);
});

test("calendar retains filters, blocked-time rendering, and has no drag-and-drop mutation", () => {
  const page = read("app/admin/calendar/page.tsx");
  assert.match(page, /name="doctorId"/);
  assert.match(page, /name="serviceId"/);
  assert.match(page, /name="roomId"/);
  assert.match(page, /name="status"/);
  assert.match(page, /Blocked time/);
  assert.doesNotMatch(page, /draggable|onDragStart|onDrop|drag-and-drop/i);
});
