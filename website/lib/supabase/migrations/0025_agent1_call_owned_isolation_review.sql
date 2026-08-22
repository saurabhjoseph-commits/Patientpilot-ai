-- Agent 1 Day 1B REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
-- Makes call summaries and AI actions explicitly clinic-owned through calls.
-- This is a single transaction: any ambiguous historical row rolls back all DDL.

begin;

do $$
begin
  if to_regclass('public.clinics') is null
    or to_regclass('public.calls') is null
    or to_regclass('public.call_summaries') is null
    or to_regclass('public.ai_actions') is null then
    raise exception 'Call ownership isolation blocked: required table is missing';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name in ('calls', 'call_summaries', 'ai_actions')
      and column_name = 'clinic_id'
      and table_name in ('call_summaries', 'ai_actions')
  ) then
    raise exception 'Call ownership isolation blocked: a target clinic_id column already exists; inspect partial or prior deployment';
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.calls'::regclass and conname = 'calls_call_sid_key' and contype = 'u'
  ) then
    raise exception 'Call ownership isolation blocked: calls.call_sid is not backed by the verified unique constraint';
  end if;
  if exists (select 1 from public.calls where clinic_id is null) then
    raise exception 'Call ownership isolation blocked: calls.clinic_id contains null values';
  end if;
  if exists (
    select 1 from public.call_summaries s
    left join public.calls c on c.call_sid = s.call_sid
    where c.id is null or c.clinic_id is null
  ) then
    raise exception 'Call ownership isolation blocked: a call summary has no verified clinic-owned call matching call_sid';
  end if;
  if exists (
    select 1 from public.ai_actions a
    left join public.calls c on c.id = a.call_id
    where a.call_id is null or c.id is null or c.clinic_id is null
  ) then
    raise exception 'Call ownership isolation blocked: an AI action has no verified clinic-owned parent call';
  end if;
end
$$;

alter table public.calls add constraint calls_id_clinic_id_key unique (id, clinic_id);

alter table public.call_summaries add column call_id uuid;
alter table public.call_summaries add column clinic_id uuid;
update public.call_summaries s
set call_id = c.id, clinic_id = c.clinic_id
from public.calls c
where c.call_sid = s.call_sid;

alter table public.ai_actions add column clinic_id uuid;
update public.ai_actions a
set clinic_id = c.clinic_id
from public.calls c
where c.id = a.call_id;

do $$
begin
  if exists (select 1 from public.call_summaries where call_id is null or clinic_id is null)
    or exists (select 1 from public.ai_actions where call_id is null or clinic_id is null) then
    raise exception 'Call ownership isolation blocked: backfill left an unowned summary or AI action';
  end if;
end
$$;

alter table public.call_summaries alter column call_id set not null;
alter table public.call_summaries alter column clinic_id set not null;
alter table public.ai_actions alter column call_id set not null;
alter table public.ai_actions alter column clinic_id set not null;

alter table public.call_summaries
  add constraint call_summaries_clinic_id_fkey
  foreign key (clinic_id) references public.clinics(id) on update no action on delete restrict,
  add constraint call_summaries_call_id_fkey
  foreign key (call_id) references public.calls(id) on update no action on delete restrict,
  add constraint call_summaries_call_clinic_id_fkey
  foreign key (call_id, clinic_id) references public.calls(id, clinic_id) on update no action on delete restrict;

alter table public.ai_actions
  add constraint ai_actions_clinic_id_fkey
  foreign key (clinic_id) references public.clinics(id) on update no action on delete restrict,
  add constraint ai_actions_call_clinic_id_fkey
  foreign key (call_id, clinic_id) references public.calls(id, clinic_id) on update no action on delete restrict;

create index call_summaries_clinic_id_idx on public.call_summaries (clinic_id);
create index ai_actions_clinic_id_idx on public.ai_actions (clinic_id);

commit;

-- Verification (manual, read-only):
-- select count(*) filter (where clinic_id is null) as null_clinic_id from public.call_summaries;
-- select count(*) filter (where clinic_id is null) as null_clinic_id from public.ai_actions;
-- select s.id from public.call_summaries s join public.calls c on c.id = s.call_id where s.clinic_id <> c.clinic_id;
-- select a.id from public.ai_actions a join public.calls c on c.id = a.call_id where a.clinic_id <> c.clinic_id;
-- Rollback: only before application deployment starts writing the new columns;
-- drop the new constraints/indexes and columns in a separately reviewed transaction.
