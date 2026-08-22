-- Agent 1 Day 1 REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
-- Adds the missing authoritative clinic ownership key to public.patients.
-- Existing rows are backfilled only from one verified call_summaries.patient_id
-- -> calls.call_sid -> calls.clinic_id relationship. All other rows fail closed.

begin;

do $$
begin
  if to_regclass('public.clinics') is null
    or to_regclass('public.patients') is null
    or to_regclass('public.call_summaries') is null
    or to_regclass('public.calls') is null then
    raise exception 'Patient clinic isolation blocked: required clinics, patients, call_summaries, or calls table is missing';
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'patients' and column_name = 'clinic_id') then
    raise exception 'Patient clinic isolation blocked: patients.clinic_id already exists; inspect schema before proceeding';
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.calls'::regclass and conname = 'calls_call_sid_key' and contype = 'u'
  ) then
    raise exception 'Patient clinic isolation blocked: calls.call_sid is not backed by the verified unique constraint';
  end if;
end
$$;

alter table public.patients add column clinic_id uuid;

do $$
begin
  -- A patient can be assigned only when every linked summary resolves through
  -- its unique CallSid to exactly one clinic-owned call. A missing summary,
  -- missing call, null call clinic, or multiple clinics is not guessable.
  if exists (
    select 1
    from public.patients p
    where (select count(*) from public.call_summaries s where s.patient_id = p.id) > 0
      and (
        select count(*) = count(c.clinic_id)
          and count(distinct c.clinic_id) = 1
        from public.call_summaries s
        left join public.calls c on c.call_sid = s.call_sid
        where s.patient_id = p.id
      ) is not true
  ) then
    raise exception 'Patient clinic isolation blocked: at least one patient has ambiguous, missing, or cross-clinic call-summary ownership';
  end if;

  if exists (
    select 1
    from public.patients p
    where not exists (select 1 from public.call_summaries s where s.patient_id = p.id)
  ) then
    raise exception 'Patient clinic isolation blocked: at least one patient has no deterministic call-summary ownership source';
  end if;
end
$$;

update public.patients p
set clinic_id = (
  select min(c.clinic_id)
  from public.call_summaries s
  join public.calls c on c.call_sid = s.call_sid
  where s.patient_id = p.id
);

do $$
begin
  if exists (select 1 from public.patients where clinic_id is null) then
    raise exception 'Patient clinic isolation blocked: deterministic ownership backfill left null clinic_id values';
  end if;
end
$$;

alter table public.patients alter column clinic_id set not null;
alter table public.patients add constraint patients_clinic_id_fkey
  foreign key (clinic_id) references public.clinics(id) on update no action on delete restrict;
create index patients_clinic_id_idx on public.patients (clinic_id);

commit;

-- Verification (manual, read-only):
-- select column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'patients' and column_name = 'clinic_id';
-- select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.patients'::regclass and conname = 'patients_clinic_id_fkey';
-- select indexname, indexdef from pg_indexes where schemaname = 'public' and tablename = 'patients' and indexname = 'patients_clinic_id_idx';
-- Rollback (manual, only before any clinic-owned patient is written):
-- begin; drop index public.patients_clinic_id_idx; alter table public.patients drop constraint patients_clinic_id_fkey, drop column clinic_id; commit;
