-- G1 REVIEW-ONLY / READ-ONLY. Execute manually; do not apply schema changes.
-- Inventory required India-launch clinical baseline and detect missing contracts.
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('clinics','clinic_settings','profiles','patients','appointments','calls','call_messages','call_summaries','estimates','estimate_items','invoices','payments','users','roles','communication_preferences','clinic_services')
order by table_name;

select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('clinics','clinic_settings','profiles','patients','appointments','calls','call_messages','call_summaries','estimates','estimate_items','invoices','payments','users','roles','communication_preferences','clinic_services')
order by table_name, ordinal_position;

select conrelid::regclass::text as table_name, conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where connamespace = 'public'::regnamespace
  and conrelid::regclass::text in ('clinics','clinic_settings','profiles','patients','appointments','calls','call_messages','call_summaries')
order by table_name, conname;

select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('clinics','clinic_settings','profiles','patients','appointments','calls','call_messages','call_summaries')
order by tablename, indexname;

select c.relname as table_name, c.relrowsecurity as rls_enabled, p.policyname, p.roles, p.cmd
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p on p.schemaname = n.nspname and p.tablename = c.relname
where n.nspname = 'public'
  and c.relname in ('clinics','clinic_settings','profiles','patients','appointments','calls','call_messages','call_summaries')
order by table_name, policyname;

-- Current relationship shape / backfill evidence.
select
  (select count(*) from public.patients) as patients,
  (select count(*) from public.appointments) as appointments,
  (select count(*) from public.appointments where clinic_id is null) as appointments_without_clinic;
