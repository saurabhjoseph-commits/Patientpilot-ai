-- RC5 STAGING COMPATIBILITY REPAIR.
-- Verified target: PatientPilot AI Staging (tgpcgyuujaklgepknucd).
-- Do not apply automatically or to production.
--
-- Historical adaptation:
-- 0000_j2_staging_baseline_schema.sql defined contacts.id as a required bigint
-- without a generated value. Its companion synthetic seed supplied fixed IDs,
-- so the omission was not detected by the legacy exact-row-count migrations.
-- RC5's server repository correctly omits id and expects the database to assign it.
-- This repair preserves existing rows and installs an owned sequence safely.

begin;

lock table public.contacts in share row exclusive mode;

do $$
declare
  current_type text;
  current_nullable text;
  current_default text;
begin
  select data_type, is_nullable, column_default
    into current_type, current_nullable, current_default
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'contacts'
    and column_name = 'id';

  if current_type is distinct from 'bigint' or current_nullable is distinct from 'NO' then
    raise exception 'RC5 contacts identity repair refused: contacts.id contract drifted';
  end if;

  if current_default is not null then
    raise exception 'RC5 contacts identity repair refused: contacts.id already has a default';
  end if;
end
$$;

create sequence public.contacts_id_seq as bigint;
alter sequence public.contacts_id_seq owned by public.contacts.id;
select setval(
  'public.contacts_id_seq',
  coalesce((select max(id) from public.contacts), 0) + 1,
  false
);
alter table public.contacts
  alter column id set default nextval('public.contacts_id_seq'::regclass);

grant usage, select on sequence public.contacts_id_seq to service_role;

commit;

-- Migration 0029 is applied separately and remains the source of truth for the
-- demo-request outbox, delivery events, constraints, RLS, and enqueue trigger.
