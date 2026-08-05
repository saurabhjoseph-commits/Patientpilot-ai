-- REVIEW-ONLY. Execute manually in the production Supabase SQL Editor.
-- This transaction creates no duplicate clinic: clinics.slug has a verified unique constraint.
begin;

do $$
begin
  if exists (select 1 from public.clinics where slug = 'patientpilot-india-demo') then
    raise exception 'Clinic slug patientpilot-india-demo already exists';
  end if;
end $$;

insert into public.clinics (name, slug, country, timezone)
values ('PatientPilot India Demo Clinic', 'patientpilot-india-demo', 'India', 'Asia/Kolkata')
returning id, name, slug, country, timezone;

commit;

-- Post-execution verification (read-only):
-- select id, name, slug, country, timezone from public.clinics where slug = 'patientpilot-india-demo';
