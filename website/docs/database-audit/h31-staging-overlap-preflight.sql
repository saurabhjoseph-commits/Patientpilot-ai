-- H3.1B READ-ONLY STAGING PREFLIGHT. Run this before migration 0023.
-- Returns only operational UUIDs, local appointment date/time, and conflict kind.
-- The validation block is procedural but read-only: it raises on drift and changes no state.
do $$
begin
  if to_regclass('public.clinics') is null or to_regclass('public.appointments') is null then
    raise exception 'H3.1 preflight blocked: required public.clinics or public.appointments table is missing';
  end if;
  if (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name in ('id','clinic_id','doctor_id','room_id') and data_type = 'uuid') <> 4
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name in ('appointment_date','appointment_time','status') and data_type = 'text') <> 3
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name = 'duration_minutes' and data_type = 'integer') <> 1 then
    raise exception 'H3.1 preflight blocked: public.appointments does not match the verified overlap contract';
  end if;
  if (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name in ('id','clinic_id','appointment_date','appointment_time','status') and is_nullable = 'NO') <> 5 then
    raise exception 'H3.1 preflight blocked: required appointment identity, clinic, date, time, or status is nullable';
  end if;
  if exists (select 1 from public.appointments where (doctor_id is not null or room_id is not null) and (duration_minutes is null or duration_minutes <= 0 or appointment_time !~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9](?:[.][0-9]+)?)?$')) then
    raise exception 'H3.1 preflight blocked: linked appointment has an invalid duration or time value';
  end if;
end
$$;

with capacity as (
  select id, clinic_id, doctor_id, room_id, appointment_date, appointment_time::time as start_time,
    appointment_time::time + make_interval(mins => duration_minutes) as end_time
  from public.appointments
  where status not in ('Cancelled', 'Completed')
    and duration_minutes is not null and duration_minutes > 0
    and appointment_time ~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9](?:[.][0-9]+)?)?$'
)
select 'doctor'::text as conflict_kind, existing.clinic_id, existing.doctor_id, null::uuid as room_id,
  existing.appointment_date, existing.id as existing_appointment_id, candidate.id as candidate_appointment_id,
  existing.start_time as existing_start_time, existing.end_time as existing_end_time,
  candidate.start_time as candidate_start_time, candidate.end_time as candidate_end_time
from capacity existing
join capacity candidate on candidate.clinic_id = existing.clinic_id and candidate.appointment_date = existing.appointment_date
  and candidate.id > existing.id and existing.doctor_id is not null and candidate.doctor_id = existing.doctor_id
  and existing.start_time < candidate.end_time and existing.end_time > candidate.start_time
union all
select 'room'::text, existing.clinic_id, null::uuid, existing.room_id,
  existing.appointment_date, existing.id, candidate.id,
  existing.start_time, existing.end_time, candidate.start_time, candidate.end_time
from capacity existing
join capacity candidate on candidate.clinic_id = existing.clinic_id and candidate.appointment_date = existing.appointment_date
  and candidate.id > existing.id and existing.room_id is not null and candidate.room_id = existing.room_id
  and existing.start_time < candidate.end_time and existing.end_time > candidate.start_time
order by clinic_id, appointment_date, conflict_kind, existing_appointment_id;

-- PASS: zero rows. FAIL: do not apply migration; remediate the listed UUIDs manually,
-- then run this file again. This script does not mutate any row.
