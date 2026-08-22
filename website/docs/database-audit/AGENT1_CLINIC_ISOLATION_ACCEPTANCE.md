# Agent 1 — Clinic A/B Database Acceptance Harness

This is a manual staging-only acceptance procedure. It must never run against
production and it must use disposable clinics, Supabase Auth users, and data.
No service-role key is used by the browser assertions.

## Prerequisites

1. Apply and verify J.2 clinic ownership constraints.
2. Apply the reviewed `0024_agent1_patient_clinic_isolation_review.sql` and
   `0025_agent1_call_owned_isolation_review.sql` migrations in staging.
3. Create two disposable Supabase Auth users and matching `profiles` rows:
   one profile per clinic, with only clinic-scoped staff permissions.
4. Create two disposable clinics and save their UUIDs outside source control.
5. Configure a trusted `TELEPHONY_CLINIC_PHONE_MAP` mapping for two disposable
   provider destination numbers. Do not use production numbers or credentials.

## Seed requirements

Using authenticated, server-authorized application flows only, create:

| Clinic A | Clinic B |
| --- | --- |
| Patient A | Patient B |
| Appointment A | Appointment B |
| Call A | Call B |
| Transcript A | Transcript B |
| Summary A | Summary B |
| AI Action A | AI Action B |

Record only the disposable UUIDs in the staging test worksheet. The `call_id`
and `clinic_id` on summaries/actions must match the parent call.

## Browser/API assertions for each clinic user

For every Clinic B resource, the Clinic A session must receive a 404 or 403
for all three actions: read, update, and delete. Repeat symmetrically for the
Clinic B session against Clinic A data.

The checks must cover patient, appointment, call, transcript, summary, and AI
action routes/services. Do not substitute a service-role client for these
tests. Confirm the admin UI never lists the other clinic's resources.

## Service-role regression assertions

Use only server-side routes with an authenticated Clinic A request context:

1. A request containing a Clinic B resource ID must not read, update, delete,
   or append an activity/transcript record to it.
2. A client-supplied `clinic_id` must be ignored or rejected; the persisted
   clinic must equal the server-derived profile or verified telephony scope.
3. A verified provider callback using an unmapped destination must fail before
   any call, summary, appointment, or AI-action write.

## Database consistency queries

Run these read-only queries in the staging SQL editor after the tests. They
return zero rows on success and must not display clinical content:

```sql
select s.id
from public.call_summaries s
join public.calls c on c.id = s.call_id
where s.clinic_id <> c.clinic_id;

select a.id
from public.ai_actions a
join public.calls c on c.id = a.call_id
where a.clinic_id <> c.clinic_id;

select p.id
from public.patients p
left join public.clinics c on c.id = p.clinic_id
where p.clinic_id is null or c.id is null;
```

Capture non-sensitive pass/fail results under the staging audit folder. Delete
the disposable staging data only through a separately approved cleanup plan.
