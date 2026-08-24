-- AGENT 12 REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
-- Adds the least-privilege ai_operator profile role and explicit synthetic-data
-- markers. It creates no users, grants no database privileges, and changes no RLS.

begin;

do $$
declare
  current_definition text;
  expected_definition constant text := 'CHECK ((role = ANY (ARRAY[''super_admin''::text, ''owner''::text, ''manager''::text, ''receptionist''::text, ''dentist''::text, ''doctor''::text])))';
begin
  select pg_get_constraintdef(oid) into current_definition
  from pg_constraint
  where conrelid = 'public.profiles'::regclass
    and conname = 'profiles_role_check'
    and contype = 'c';

  if current_definition is null then
    raise exception 'Agent 12 blocked: profiles_role_check is missing';
  end if;
  if current_definition <> expected_definition then
    raise exception 'Agent 12 blocked: profiles_role_check drifted. Expected %, found %', expected_definition, current_definition;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name in ('clinics', 'leads', 'patients', 'appointments')
      and column_name = 'is_test'
  ) then
    raise exception 'Agent 12 blocked: an is_test column already exists and requires manual reconciliation';
  end if;
end
$$;

alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role = any (array['super_admin'::text, 'owner'::text, 'manager'::text, 'receptionist'::text, 'dentist'::text, 'doctor'::text, 'ai_operator'::text]));

alter table public.clinics add column is_test boolean not null default false;
alter table public.leads add column is_test boolean not null default false;
alter table public.patients add column is_test boolean not null default false;
alter table public.appointments add column is_test boolean not null default false;

create index clinics_agent12_test_rows_idx on public.clinics (id) where is_test;
create index leads_agent12_test_rows_idx on public.leads (clinic_id, id) where is_test;
create index patients_agent12_test_rows_idx on public.patients (clinic_id, id) where is_test;
create index appointments_agent12_test_rows_idx on public.appointments (clinic_id, id) where is_test;

commit;

-- READ-ONLY POST-EXECUTION VERIFICATION:
-- select role, count(*) from public.profiles group by role order by role;
-- select table_name, column_name, column_default, is_nullable from information_schema.columns where table_schema = 'public' and table_name in ('clinics','leads','patients','appointments') and column_name = 'is_test' order by table_name;

-- ROLLBACK (manual only; fails closed if any operator or synthetic rows exist):
-- begin;
-- do $$ begin
--   if exists (select 1 from public.profiles where role = 'ai_operator') then raise exception 'Rollback blocked: ai_operator profiles exist'; end if;
--   if exists (select 1 from public.clinics where is_test) or exists (select 1 from public.leads where is_test) or exists (select 1 from public.patients where is_test) or exists (select 1 from public.appointments where is_test) then raise exception 'Rollback blocked: synthetic E2E rows exist'; end if;
-- end $$;
-- drop index public.appointments_agent12_test_rows_idx; drop index public.patients_agent12_test_rows_idx; drop index public.leads_agent12_test_rows_idx; drop index public.clinics_agent12_test_rows_idx;
-- alter table public.appointments drop column is_test; alter table public.patients drop column is_test; alter table public.leads drop column is_test; alter table public.clinics drop column is_test;
-- alter table public.profiles drop constraint profiles_role_check;
-- alter table public.profiles add constraint profiles_role_check check (role = any (array['super_admin'::text, 'owner'::text, 'manager'::text, 'receptionist'::text, 'dentist'::text, 'doctor'::text]));
-- commit;
