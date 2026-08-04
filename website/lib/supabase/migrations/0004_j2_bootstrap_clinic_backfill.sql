-- Review before applying. Creates the owner-approved bootstrap clinic and assigns existing unowned data.
begin;
set local transaction isolation level serializable;
do $$
declare bootstrap_clinic_id uuid; parent_assigned integer; fallback_assigned integer;
begin
  if to_regclass('public.clinics') is null
    or to_regclass('public.contacts') is null
    or to_regclass('public.appointments') is null
    or to_regclass('public.calls') is null
    or to_regclass('public.call_messages') is null
    or to_regclass('public.clinic_settings') is null
    or to_regclass('public.lead_activity') is null then
    raise exception 'J.2 backfill refused: required tables are missing';
  end if;

  lock table public.clinics, public.contacts, public.appointments,
    public.calls, public.call_messages, public.clinic_settings,
    public.lead_activity in share row exclusive mode;

  if (select count(*) from public.clinics) <> 0
    or (select count(*) from public.clinic_settings) <> 0
    or (select count(*) from public.contacts) <> 3 or (select count(*) from public.contacts where clinic_id is null) <> 3
    or (select count(*) from public.appointments) <> 4 or (select count(*) from public.appointments where clinic_id is null) <> 4
    or (select count(*) from public.calls) <> 4 or (select count(*) from public.calls where clinic_id is null) <> 4
    or (select count(*) from public.call_messages) <> 1 or (select count(*) from public.call_messages where clinic_id is null) <> 1
    or (select count(*) from public.lead_activity) <> 3 then
    raise exception 'J.2 backfill refused: preflight ownership counts no longer match';
  end if;

  if exists (select 1 from public.call_messages m left join public.calls c on c.id = m.call_id where m.call_id is not null and c.id is null)
    or exists (select 1 from public.lead_activity a left join public.contacts c on c.id = a.lead_id where c.id is null) then
    raise exception 'J.2 backfill refused: orphaned parent relationship detected';
  end if;

  insert into public.clinics (name, slug, country, timezone)
  values ('PatientPilot Demo Clinic', 'patientpilot-demo', 'India', 'Asia/Kolkata')
  returning id into bootstrap_clinic_id;

  if (select count(*) from public.clinics where id = bootstrap_clinic_id and name = 'PatientPilot Demo Clinic' and slug = 'patientpilot-demo') <> 1
    or (select count(*) from public.clinics) <> 1 then
    raise exception 'J.2 backfill failed: bootstrap clinic verification failed';
  end if;

  update public.contacts set clinic_id = bootstrap_clinic_id where clinic_id is null;
  if (select count(*) from public.contacts where clinic_id = bootstrap_clinic_id) <> 3 then raise exception 'J.2 backfill failed: expected three contacts assigned'; end if;
  update public.appointments set clinic_id = bootstrap_clinic_id where clinic_id is null;
  if (select count(*) from public.appointments where clinic_id = bootstrap_clinic_id) <> 4 then raise exception 'J.2 backfill failed: expected four appointments assigned'; end if;
  update public.calls set clinic_id = bootstrap_clinic_id where clinic_id is null;
  if (select count(*) from public.calls where clinic_id = bootstrap_clinic_id) <> 4 then raise exception 'J.2 backfill failed: expected four calls assigned'; end if;
  update public.call_messages m set clinic_id = c.clinic_id from public.calls c where m.clinic_id is null and m.call_id = c.id and c.clinic_id is not null;
  get diagnostics parent_assigned = row_count;

  if exists (select 1 from public.call_messages m left join public.calls c on c.id = m.call_id where m.clinic_id is null and (m.call_id is null or c.id is null)) then
    raise notice 'J.2 backfill reporting orphan call messages before fallback ownership assignment';
  end if;

  update public.call_messages set clinic_id = bootstrap_clinic_id where clinic_id is null;
  get diagnostics fallback_assigned = row_count;

  if parent_assigned + fallback_assigned <> 1
    or (select count(*) from public.call_messages where clinic_id = bootstrap_clinic_id) <> 1
    or (select count(*) from public.call_messages where clinic_id is null) <> 0 then
    raise exception 'J.2 backfill failed: call message ownership verification failed';
  end if;

  if (select count(*) from public.lead_activity) <> 3
    or exists (select 1 from public.lead_activity a left join public.contacts c on c.id = a.lead_id where c.id is null) then
    raise exception 'J.2 backfill failed: lead activity ownership verification failed';
  end if;

  raise notice 'J.2 assigned contacts=3 appointments=4 calls=4 call_messages_from_parent=% call_messages_fallback=%', parent_assigned, fallback_assigned;
end $$;
commit;
