# H3.1B staging concurrency verification

Target only the Supabase staging project. Do not run these steps in production.

## Before migration

1. Confirm the project reference and backup/restore posture in the Supabase dashboard.
2. Record both the count and safe operational-row snapshots from `h31-staging-post-migration-verification.sql`.
3. Run [h31-staging-overlap-preflight.sql](h31-staging-overlap-preflight.sql). Continue only when it returns zero rows.
4. If it returns rows, manually remediate only the listed appointment UUIDs. Do not apply migration `0023` until the preflight is clean.
5. Manually execute [0023_h31_appointment_overlap_guard_review.sql](../../lib/supabase/migrations/0023_h31_appointment_overlap_guard_review.sql), then run the post-migration verification SQL. Confirm one enabled `BEFORE INSERT OR UPDATE` trigger, its function, both existing H2.1 indexes, unchanged row counts, and an identical safe operational-row snapshot.

## Disposable test data

Use an existing disposable staging clinic, or create a dedicated test clinic through approved staging tooling. It must contain two active doctors, two active rooms, one active service, valid doctor-service and doctor-room assignments, valid schedules, and a positive duration. Do not use patient data; use a synthetic name and `h31-test-*` source marker.

Record the generated clinic, doctor, room, and appointment UUIDs outside the application repository. Replace the angle-bracket values below only in the SQL Editor.

## Independent-session concurrency matrix

Open two SQL Editor sessions. In each session use `begin;`, run the supplied insert, and leave session A uncommitted while session B runs. Commit A; B must then fail with SQLSTATE `23P01`. Roll back B after the error.

For every insert use this shape, with synthetic data only:

```sql
insert into public.appointments (clinic_id, patient_name, service, appointment_date, appointment_time, duration_minutes, doctor_id, room_id, status, source)
values ('<clinic-uuid>', 'H31 synthetic', 'H31 test service', '<yyyy-mm-dd>', '<hh:mm>', 30, '<doctor-uuid>', '<room-uuid>', 'Confirmed', 'h31-test-concurrency')
returning id;
```

| Test | Session A / B resources | Expected |
| --- | --- | --- |
| Same doctor, same room | A/Room1 vs A/Room1, same interval | Exactly one succeeds; the other is `23P01`. |
| Same doctor, different rooms | A/Room1 vs A/Room2, same interval | Exactly one succeeds; the other is `23P01`. |
| Different doctors, same room | A/Room1 vs B/Room1, same interval | Exactly one succeeds; the other is `23P01`. |
| Different doctors, different rooms | A/Room1 vs B/Room2, same interval | Both succeed. |
| Back-to-back | Same doctor/room, 10:00–10:30 and 10:30–11:00 | Both succeed. |
| Partial overlap | Same doctor/room, 10:00–10:30 then 10:15–10:45 and 09:45–10:15 | Later attempts are `23P01`. |
| Cancellation release | Cancel original, then create its same interval | New insert succeeds; cancelled row remains. |
| Completed release | Mark original `Completed`, then create its same interval | New insert succeeds; completed row remains. |
| Reschedule | Move 11:00 appointment onto 10:00 booking, then to a free time | First update is `23P01`; second succeeds; ordinary self-update succeeds. |

## Application checks

After the SQL matrix, use the authenticated staging admin appointment API/UI to submit an overlap. Expect HTTP 409 with `APPOINTMENT_SLOT_CONFLICT` and a safe conflict message. Then reproduce an AI check → intervening booking → confirmation sequence. The AI must not report success and must offer authoritative alternatives.

## Integrity and cleanup

Run the preflight again: it must return zero rows. Confirm synthetic cancelled and completed rows still exist, no production-like patient data was introduced, and no other clinic was touched.

For cleanup, target only appointment IDs returned by the test inserts. Replace every placeholder before running; never use a clinic-wide delete:

```sql
begin;
delete from public.appointments
where id in ('<test-appointment-uuid-1>'::uuid, '<test-appointment-uuid-2>'::uuid)
  and source = 'h31-test-concurrency';
commit;
```

## Emergency rollback

Only if required after a verified migration issue:

```sql
begin;
drop trigger appointments_prevent_overlap on public.appointments;
drop function public.prevent_appointment_overlap();
commit;
```

Rollback removes only the H3.1 guard objects. It never deletes or alters appointments.

## Production gate

Production is eligible only after every staging preflight, trigger verification, matrix case, API conflict mapping, AI race behavior, and integrity check passes. Keep a backup/recovery plan and this rollback ready; then repeat the read-only preflight in production before any manual migration.
