-- H3.1 REVIEW-ONLY / MANUAL STAGING EXECUTION REQUIRED.
-- One-time, transaction-bound guard for H2.1 clinically linked appointments.
-- It preserves all rows and creates no RLS policy, backfill, or browser access path.

begin;

do $$
declare
  conflict_record record;
begin
  if to_regclass('public.appointments') is null then
    raise exception 'H3.1 blocked: public.appointments is missing';
  end if;

  -- Exact H2.1 scheduling contract. No timestamp columns are assumed.
  if (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name in ('id','clinic_id','doctor_id','room_id') and data_type = 'uuid') <> 4
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name in ('appointment_date','appointment_time','status') and data_type = 'text') <> 3
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name = 'duration_minutes' and data_type = 'integer') <> 1 then
    raise exception 'H3.1 blocked: public.appointments does not match the verified H2.1 overlap contract';
  end if;
  if (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name in ('id','clinic_id','appointment_date','appointment_time','status') and is_nullable = 'NO') <> 5 then
    raise exception 'H3.1 blocked: required appointment identity, clinic, date, time, or status is nullable';
  end if;
  if exists (select 1 from public.appointments where (doctor_id is not null or room_id is not null) and (duration_minutes is null or duration_minutes <= 0 or appointment_time !~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9](?:[.][0-9]+)?)?$')) then
    raise exception 'H3.1 blocked: linked appointment has an invalid duration or time value';
  end if;

  -- Existing invalid overlaps must be remediated manually before a future write can
  -- be protected. The exception exposes only safe appointment UUIDs and date.
  select existing.clinic_id, existing.appointment_date, existing.id as existing_id, candidate.id as candidate_id
  into conflict_record
  from public.appointments existing
  join public.appointments candidate
    on candidate.clinic_id = existing.clinic_id
   and candidate.appointment_date = existing.appointment_date
   and candidate.id > existing.id
   and candidate.status not in ('Cancelled', 'Completed')
   and existing.status not in ('Cancelled', 'Completed')
   and candidate.duration_minutes is not null and candidate.duration_minutes > 0
   and existing.duration_minutes is not null and existing.duration_minutes > 0
   and ((candidate.doctor_id is not null and candidate.doctor_id = existing.doctor_id)
     or (candidate.room_id is not null and candidate.room_id = existing.room_id))
   and existing.appointment_time::time < candidate.appointment_time::time + make_interval(mins => candidate.duration_minutes)
   and existing.appointment_time::time + make_interval(mins => existing.duration_minutes) > candidate.appointment_time::time
  limit 1;
  if found then
    raise exception 'H3.1 blocked: existing appointment overlap in clinic %, date %, appointments % and %', conflict_record.clinic_id, conflict_record.appointment_date, conflict_record.existing_id, conflict_record.candidate_id;
  end if;

  if exists (select 1 from pg_trigger where tgrelid = 'public.appointments'::regclass and tgname = 'appointments_prevent_overlap' and not tgisinternal)
    or to_regprocedure('public.prevent_appointment_overlap()') is not null then
    raise exception 'H3.1 blocked: overlap guard already exists; inspect its provenance before changing it';
  end if;
end
$$;

create function public.prevent_appointment_overlap()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  resource_key text;
begin
  -- Legacy unlinked rows remain untouched. A new or updated clinically linked row
  -- must have a positive authoritative duration before overlap can be evaluated.
  if new.doctor_id is null and new.room_id is null then
    return new;
  end if;
  if new.duration_minutes is null or new.duration_minutes <= 0 then
    raise exception 'H3.1 invalid linked appointment duration' using errcode = '23514';
  end if;
  if new.status in ('Cancelled', 'Completed') then
    return new;
  end if;

  -- Sorted, transaction-scoped resource locks prevent opposite-order deadlocks.
  -- A 64-bit hash collision can only add harmless serialization, never permit an
  -- overlap. Keys include clinic + date + resource kind + UUID for tenant isolation.
  for resource_key in
    select distinct key from unnest(array[
      case when new.doctor_id is null then null else new.clinic_id::text || ':' || new.appointment_date::text || ':doctor:' || new.doctor_id::text end,
      case when new.room_id is null then null else new.clinic_id::text || ':' || new.appointment_date::text || ':room:' || new.room_id::text end,
      case when tg_op = 'UPDATE' and old.doctor_id is not null then old.clinic_id::text || ':' || old.appointment_date::text || ':doctor:' || old.doctor_id::text end,
      case when tg_op = 'UPDATE' and old.room_id is not null then old.clinic_id::text || ':' || old.appointment_date::text || ':room:' || old.room_id::text end
    ]) as resource(key) where key is not null order by key
  loop
    perform pg_advisory_xact_lock(hashtextextended(resource_key, 31));
  end loop;

  if exists (
    select 1 from public.appointments existing
    where existing.id is distinct from new.id
      and existing.clinic_id = new.clinic_id
      and existing.appointment_date = new.appointment_date
      and existing.status not in ('Cancelled', 'Completed')
      and existing.duration_minutes is not null and existing.duration_minutes > 0
      and ((new.doctor_id is not null and existing.doctor_id = new.doctor_id)
        or (new.room_id is not null and existing.room_id = new.room_id))
      -- Half-open intervals: back-to-back appointments are permitted.
      and existing.appointment_time::time < new.appointment_time::time + make_interval(mins => new.duration_minutes)
      and existing.appointment_time::time + make_interval(mins => existing.duration_minutes) > new.appointment_time::time
  ) then
    raise exception 'H3.1 appointment slot conflict' using errcode = '23P01';
  end if;
  return new;
end;
$$;

create trigger appointments_prevent_overlap
before insert or update of clinic_id, doctor_id, room_id, appointment_date, appointment_time, duration_minutes, status
on public.appointments
for each row execute function public.prevent_appointment_overlap();

commit;

-- Verification (manual, immediately after commit):
-- select tgname, pg_get_triggerdef(oid) from pg_trigger where tgrelid = 'public.appointments'::regclass and tgname = 'appointments_prevent_overlap';
-- select proname, pg_get_functiondef(oid) from pg_proc where oid = 'public.prevent_appointment_overlap()'::regprocedure;
-- Existing H2.1 indexes are sufficient: appointments_clinic_doctor_date_idx and
-- appointments_clinic_room_date_idx both lead with clinic/date resource lookups.
-- Rollback (manual, only if no dependency on the guard has been introduced):
-- begin; drop trigger appointments_prevent_overlap on public.appointments; drop function public.prevent_appointment_overlap(); commit;
