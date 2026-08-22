# H3.1C staging schema reconciliation

Staging is missing the approved G2–H2.1 scheduling schema. Do not apply H3.1 migration `0023` until this plan completes with PASS results.

## Approved source inventory

| Object | Source | Follow-up / dependency | Required application contract |
| --- | --- | --- | --- |
| `clinic_services` | `0017_g2_clinic_services.sql` | `0018`, `0020`; depends on `clinics` | UUID PK, clinic FK, name, positive default duration, active, composite `(id, clinic_id)` unique, clinic/active index, RLS enabled. |
| `doctors` | `0018_g3_doctors.sql` | `0019`, `0020`; depends on `clinics`, `auth.users` | UUID PK, clinic FK, active/inactive status, positive default duration, clinic-email unique, composite `(id, clinic_id)` unique, RLS enabled. |
| `doctor_services` | `0018_g3_doctors.sql` | availability/readiness; depends on doctors and services composite keys | `(doctor_id, service_id)` PK, clinic-scoped FKs, optional positive override duration, active, clinic/active index, RLS enabled. |
| `clinic_rooms` | `0019_g4_doctor_scheduling.sql` | `0019`, `0020`; depends on `clinics` | UUID PK, clinic FK, active, name/code uniqueness, composite `(id, clinic_id)` unique, RLS enabled. |
| `doctor_schedules` | `0019_g4_doctor_scheduling.sql` | readiness/availability; depends on doctors | clinic/doctor FK, weekday/time/effective-date checks, timezone, active, schedule index, RLS enabled. |
| `doctor_leave` | `0019_g4_doctor_scheduling.sql` | availability; depends on doctors | clinic/doctor FK, inclusive date range and check, active, index, RLS enabled. |
| `doctor_room_assignments` | `0019_g4_doctor_scheduling.sql` | `0020`, availability; depends on doctors and rooms | clinic-scoped doctor/room FKs, effective dates, active, doctor/room indexes, RLS enabled. |
| `blocked_time` | `0019_g4_doctor_scheduling.sql` | availability; depends on clinics/doctors/rooms | optional doctor/room FKs, timestamp interval/range and target checks, active, indexes, RLS enabled. |
| appointment linkage | `0020_h2_appointment_clinical_linkage.sql` | depends on `0017`–`0019`, `profiles.role` accepting `doctor` | nullable doctor/service/room UUID FKs scoped by clinic, nullable positive duration, checked/completed timestamps, calendar indexes. |
| booking policy | `0021_h3_clinic_booking_policy.sql` | depends on `clinic_settings` | nullable bounded integer notice/horizon/interval fields with range checks. |

## Historical replay decision

No new reconciliation migration is created. The missing objects exactly match the approved historical migrations and the existing staging tables are their intended dependencies. Historical files are not idempotent, so apply each only after its preflight confirms the target object/columns are absent and its dependencies are present.

`0020a_h21_doctor_profile_role_reconciliation.sql` must run before `0020_h2_appointment_clinical_linkage.sql` only if the read-only profile-role check shows the old verified constraint and the `doctor` value is absent. It must not be rerun if the constraint already permits `doctor`.

## Manual staging order

1. Run [h31-staging-schema-drift-audit.sql](h31-staging-schema-drift-audit.sql). Preserve output.
2. Confirm `clinics`, `clinic_settings`, `appointments`, and `profiles` exist. Stop for any unrelated drift.
3. Apply `0017_g2_clinic_services.sql` manually; verify its table, keys, indexes, and RLS.
4. Apply `0018_g3_doctors.sql` manually; verify doctors and doctor_services.
5. Apply `0019_g4_doctor_scheduling.sql` manually; verify all five scheduling/room tables.
6. Inspect `profiles_role_check`; apply `0020a_h21_doctor_profile_role_reconciliation.sql` only when its preflight applies.
7. Run [h31-staging-reconciliation-data-preflight.sql](h31-staging-reconciliation-data-preflight.sql). Zero rows are required; it intentionally uses only existing pre-0020 appointment columns.
8. Apply `0020_h2_appointment_clinical_linkage.sql` manually; verify linkage columns, scoped FKs, checks, and calendar indexes.
9. Apply `0021_h3_clinic_booking_policy.sql` manually; it intentionally leaves existing values null.
10. Run [h31-staging-reconciliation-verification.sql](h31-staging-reconciliation-verification.sql). Every result must be PASS.
11. Configure a disposable 10/10-ready clinic through approved staging application flows, then rerun H3 readiness and the H3.1 overlap preflight.
12. Only after those pass, manually apply `0023_h31_appointment_overlap_guard_review.sql` and follow the H3.1B concurrency runbook.

These steps preserve clinics, clinic settings, and appointments. No file in this plan truncates, drops, backfills, or deletes data.
