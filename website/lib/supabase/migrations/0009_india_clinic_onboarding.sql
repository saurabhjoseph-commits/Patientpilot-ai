-- Review and apply manually before enabling clinic onboarding in an environment.
-- The function is atomic: a failure creating clinic_settings rolls back the clinic insert.
create or replace function public.create_clinic_with_settings(
  p_name text, p_slug text, p_email text, p_phone text, p_website text, p_address text,
  p_city text, p_state text, p_country text, p_timezone text, p_greeting text,
  p_office_hours jsonb, p_voice text, p_language text, p_scheduling_rules jsonb
) returns table (id uuid) language plpgsql security definer set search_path = public as $$
declare v_clinic_id uuid;
begin
  insert into public.clinics (name, slug, email, phone, website, address, city, state, country, timezone)
  values (p_name, p_slug, p_email, p_phone, p_website, p_address, p_city, p_state, p_country, p_timezone)
  returning clinics.id into v_clinic_id;
  insert into public.clinic_settings (clinic_id, greeting, office_hours, scheduling_rules, voice, language)
  values (v_clinic_id, p_greeting, p_office_hours, p_scheduling_rules, p_voice, p_language);
  return query select v_clinic_id;
end;
$$;
revoke all on function public.create_clinic_with_settings(text,text,text,text,text,text,text,text,text,text,text,jsonb,text,text,jsonb) from public;
