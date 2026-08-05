-- REVIEW-ONLY. Execute manually in the production Supabase SQL Editor.
-- profiles.role constraint does NOT accept 'administrator'; use the approved 'super_admin' value.
begin;
do $$
declare v_admin uuid := 'ddefa653-064b-4ab6-aa95-89e4cb906921'; v_clinic uuid := '1962ea51-839f-4fbb-b0ed-b7172253241e'; v_profile public.profiles%rowtype;
begin
  if not exists (select 1 from auth.users where id = v_admin) then raise exception 'Bootstrap auth user is missing'; end if;
  if not exists (select 1 from public.clinics where id = v_clinic) then raise exception 'Bootstrap clinic is missing'; end if;
  select * into v_profile from public.profiles where id = v_admin;
  if found and (v_profile.clinic_id is distinct from v_clinic or v_profile.role is distinct from 'super_admin') then raise exception 'Existing profile has a different clinic or role'; end if;
  if not found then insert into public.profiles (id, clinic_id, full_name, role) select id, v_clinic, coalesce(raw_user_meta_data->>'full_name', email), 'super_admin' from auth.users where id = v_admin; end if;
end $$;
commit;

-- Read-only verification:
-- select p.id, p.clinic_id, p.role from public.profiles p where p.id = 'ddefa653-064b-4ab6-aa95-89e4cb906921';
