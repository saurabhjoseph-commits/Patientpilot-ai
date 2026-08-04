-- Review-only preflight. Run manually before 0004; it makes no schema changes.
DO $$
BEGIN
  if to_regclass('public.clinics') is null
    or to_regclass('public.contacts') is null
    or to_regclass('public.appointments') is null
    or to_regclass('public.calls') is null
    or to_regclass('public.call_messages') is null
    or to_regclass('public.clinic_settings') is null
    or to_regclass('public.lead_activity') is null then
    raise exception 'J.2 preflight failed: expected production tables are missing';
  end if;
  if (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'clinics' and column_name in ('id', 'name', 'slug', 'country', 'timezone')) <> 5
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'contacts' and column_name = 'clinic_id') <> 1
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name = 'clinic_id') <> 1
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'calls' and column_name = 'clinic_id') <> 1
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'call_messages' and column_name in ('call_id', 'clinic_id')) <> 2
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'clinic_settings' and column_name = 'clinic_id') <> 1
    or (select count(*) from information_schema.columns where table_schema = 'public' and table_name = 'lead_activity' and column_name = 'clinic_id') <> 0 then
    raise exception 'J.2 preflight failed: authoritative column assumptions drifted';
  end if;
  if (select count(*) from pg_constraint where conname in ('contacts_clinic_id_fkey', 'appointments_clinic_id_fkey', 'calls_clinic_id_fkey', 'call_messages_call_id_fkey', 'call_messages_clinic_id_fkey', 'clinic_settings_clinic_id_fkey', 'lead_activity_lead_id_fkey')) <> 7 then
    raise exception 'J.2 preflight failed: authoritative foreign-key assumptions drifted';
  end if;
  if (select count(*) from pg_constraint c join (values
    ('contacts_clinic_id_fkey', 'a'::"char", 'a'::"char"),
    ('appointments_clinic_id_fkey', 'a'::"char", 'a'::"char"),
    ('calls_clinic_id_fkey', 'a'::"char", 'a'::"char"),
    ('call_messages_call_id_fkey', 'a'::"char", 'c'::"char"),
    ('call_messages_clinic_id_fkey', 'a'::"char", 'a'::"char"),
    ('clinic_settings_clinic_id_fkey', 'a'::"char", 'c'::"char"),
    ('lead_activity_lead_id_fkey', 'a'::"char", 'c'::"char")
  ) as expected(conname, confupdtype, confdeltype) on c.conname = expected.conname and c.confupdtype = expected.confupdtype and c.confdeltype = expected.confdeltype) <> 7 then
    raise exception 'J.2 preflight failed: authoritative foreign-key actions drifted';
  end if;
  if (select count(*) from public.clinics) <> 0 then raise exception 'J.2 preflight failed: expected zero clinics'; end if;
  if (select count(*) from public.clinic_settings) <> 0 then raise exception 'J.2 preflight failed: expected zero clinic settings'; end if;
  if (select count(*) from public.contacts) <> 3 or (select count(*) from public.contacts where clinic_id is null) <> 3 then raise exception 'J.2 preflight failed: contacts ownership count drifted'; end if;
  if (select count(*) from public.appointments) <> 4 or (select count(*) from public.appointments where clinic_id is null) <> 4 then raise exception 'J.2 preflight failed: appointments ownership count drifted'; end if;
  if (select count(*) from public.calls) <> 4 or (select count(*) from public.calls where clinic_id is null) <> 4 then raise exception 'J.2 preflight failed: calls ownership count drifted'; end if;
  if (select count(*) from public.call_messages) <> 1 or (select count(*) from public.call_messages where clinic_id is null) <> 1 then raise exception 'J.2 preflight failed: call_messages ownership count drifted'; end if;
  if exists (select 1 from public.call_messages m left join public.calls c on c.id = m.call_id where m.call_id is not null and c.id is null) then raise exception 'J.2 preflight failed: orphaned call message parent'; end if;
  if exists (select 1 from public.lead_activity a left join public.contacts c on c.id = a.lead_id where c.id is null) then raise exception 'J.2 preflight failed: orphaned lead activity'; end if;
  if (select count(*) from public.lead_activity) <> 3 then raise exception 'J.2 preflight failed: lead activity count drifted'; end if;
END
$$;
