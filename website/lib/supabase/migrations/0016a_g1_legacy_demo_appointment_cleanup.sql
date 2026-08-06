-- G1 REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
--
-- Removes exactly the four legacy demo appointments identified by the
-- production audit. This is intentionally not a backfill: all future
-- appointments require a trusted clinic_id in the application layer.
--
-- Preconditions deliberately fail closed if the audited production state has
-- changed. Run this only in the intended production project using the
-- Supabase SQL Editor, and retain the returned appointment IDs as evidence.

begin;

do $$
declare
  appointment_count bigint;
  unowned_appointment_count bigint;
  patient_count bigint;
begin
  if to_regclass('public.appointments') is null then
    raise exception 'G1 cleanup blocked: public.appointments is missing';
  end if;

  if to_regclass('public.patients') is null then
    raise exception 'G1 cleanup blocked: public.patients is missing';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'appointments'
      and column_name = 'clinic_id'
  ) then
    raise exception 'G1 cleanup blocked: public.appointments.clinic_id is missing';
  end if;

  select count(*) into appointment_count from public.appointments;
  select count(*) into unowned_appointment_count
  from public.appointments
  where clinic_id is null;
  select count(*) into patient_count from public.patients;

  if appointment_count <> 4 or unowned_appointment_count <> 4 then
    raise exception
      'G1 cleanup blocked: expected exactly 4 appointments, all without clinic_id; found % total and % unowned',
      appointment_count,
      unowned_appointment_count;
  end if;

  if patient_count <> 0 then
    raise exception
      'G1 cleanup blocked: expected 0 patients before removing the legacy demo dataset; found %',
      patient_count;
  end if;
end
$$;

-- The audit found no patient rows and no other verified orphan-demo table.
-- This deletion is therefore deliberately limited to the four null-clinic
-- appointments; it cannot remove clinic-owned operational data.
delete from public.appointments
where clinic_id is null
returning id, clinic_id;

-- Must return zero unowned appointments before committing.
do $$
begin
  if exists (select 1 from public.appointments where clinic_id is null) then
    raise exception 'G1 cleanup failed: appointments without clinic_id remain';
  end if;
end
$$;

commit;

-- Read-only post-execution evidence query:
-- select
--   count(*) as appointments_remaining,
--   count(*) filter (where clinic_id is null) as appointments_without_clinic,
--   (select count(*) from public.patients) as patients
-- from public.appointments;
