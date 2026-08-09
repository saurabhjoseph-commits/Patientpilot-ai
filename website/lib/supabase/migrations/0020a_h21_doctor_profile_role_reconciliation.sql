-- H2.1A REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
-- This migration changes only public.profiles.role validation. It does not
-- alter existing profile rows, clinic assignments, profile IDs, or auth users.

begin;

do $$
declare
  current_definition text;
  expected_definition constant text := 'CHECK ((role = ANY (ARRAY[''super_admin''::text, ''owner''::text, ''manager''::text, ''receptionist''::text, ''dentist''::text])))';
begin
  if to_regclass('public.profiles') is null then
    raise exception 'H2.1A blocked: public.profiles is missing';
  end if;

  select pg_get_constraintdef(oid) into current_definition
  from pg_constraint
  where conrelid = 'public.profiles'::regclass
    and conname = 'profiles_role_check'
    and contype = 'c';

  if current_definition is null then
    raise exception 'H2.1A blocked: profiles_role_check is missing';
  end if;

  if current_definition <> expected_definition then
    raise exception 'H2.1A blocked: profiles_role_check drifted. Expected %, found %', expected_definition, current_definition;
  end if;

  if exists (select 1 from public.profiles where role is null or role not in ('super_admin', 'owner', 'manager', 'receptionist', 'dentist')) then
    raise exception 'H2.1A blocked: profile rows contain an unverified role value';
  end if;
end
$$;

alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role = any (array['super_admin'::text, 'owner'::text, 'manager'::text, 'receptionist'::text, 'dentist'::text, 'doctor'::text]));

commit;

-- READ-ONLY POST-EXECUTION VERIFICATION:
-- select pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.profiles'::regclass and conname = 'profiles_role_check';
-- select role, count(*) from public.profiles group by role order by role;
-- select count(*) as legacy_dentist_profiles from public.profiles where role = 'dentist';

-- ROLLBACK (manual only; it fails safely if canonical doctor rows exist):
-- begin;
-- do $$ begin if exists (select 1 from public.profiles where role = 'doctor') then raise exception 'Rollback blocked: doctor profiles exist. Reconcile them before restoring the prior constraint.'; end if; end $$;
-- alter table public.profiles drop constraint profiles_role_check;
-- alter table public.profiles add constraint profiles_role_check check (role = any (array['super_admin'::text, 'owner'::text, 'manager'::text, 'receptionist'::text, 'dentist'::text]));
-- commit;
