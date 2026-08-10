-- H3 REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
--
-- Adds the minimum clinic-level booking policy required by a future
-- availability engine. It intentionally writes no existing row, supplies no
-- implicit defaults, and creates no browser RLS policy.
--
-- Do not apply until the preflight and release approval are complete.

begin;

do $$
begin
  if to_regclass('public.clinic_settings') is null then
    raise exception 'H3 booking-policy migration blocked: public.clinic_settings is missing';
  end if;

  if (
    select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = 'clinic_settings'
      and column_name in ('clinic_id', 'office_hours')
  ) <> 2 then
    raise exception 'H3 booking-policy migration blocked: clinic_settings must retain clinic_id and office_hours';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'clinic_settings' and column_name = 'clinic_id' and is_nullable = 'NO'
  ) then
    raise exception 'H3 booking-policy migration blocked: public.clinic_settings.clinic_id must be not null';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.clinic_settings'::regclass and conname = 'clinic_settings_clinic_id_key' and contype = 'u'
  ) then
    raise exception 'H3 booking-policy migration blocked: clinic_settings must retain one row per clinic';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'clinic_settings'
      and column_name in ('minimum_booking_notice_minutes', 'maximum_booking_horizon_days', 'slot_interval_minutes')
  ) then
    raise exception 'H3 booking-policy migration blocked: one or more target columns already exist; inspect production schema before proceeding';
  end if;

  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.clinic_settings'::regclass
      and conname in ('clinic_settings_minimum_booking_notice_minutes_range', 'clinic_settings_maximum_booking_horizon_days_range', 'clinic_settings_slot_interval_minutes_range')
  ) then
    raise exception 'H3 booking-policy migration blocked: a target constraint already exists; inspect production schema before proceeding';
  end if;
end
$$;

alter table public.clinic_settings
  add column minimum_booking_notice_minutes integer null,
  add column maximum_booking_horizon_days integer null,
  add column slot_interval_minutes integer null,
  add constraint clinic_settings_minimum_booking_notice_minutes_range
    check (minimum_booking_notice_minutes is null or minimum_booking_notice_minutes between 0 and 10080),
  add constraint clinic_settings_maximum_booking_horizon_days_range
    check (maximum_booking_horizon_days is null or maximum_booking_horizon_days between 1 and 730),
  add constraint clinic_settings_slot_interval_minutes_range
    check (slot_interval_minutes is null or (slot_interval_minutes between 5 and 240 and mod(slot_interval_minutes, 5) = 0));

commit;

-- POST-EXECUTION VERIFICATION (manual, read-only):
-- select column_name, data_type, is_nullable
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'clinic_settings'
--   and column_name in ('minimum_booking_notice_minutes', 'maximum_booking_horizon_days', 'slot_interval_minutes')
-- order by column_name;
--
-- select conname, pg_get_constraintdef(oid)
-- from pg_constraint
-- where conrelid = 'public.clinic_settings'::regclass
--   and conname in ('clinic_settings_minimum_booking_notice_minutes_range', 'clinic_settings_maximum_booking_horizon_days_range', 'clinic_settings_slot_interval_minutes_range')
-- order by conname;
--
-- ROLLBACK (manual, only before any runtime depends on these columns):
-- begin;
-- alter table public.clinic_settings
--   drop constraint if exists clinic_settings_minimum_booking_notice_minutes_range,
--   drop constraint if exists clinic_settings_maximum_booking_horizon_days_range,
--   drop constraint if exists clinic_settings_slot_interval_minutes_range,
--   drop column if exists minimum_booking_notice_minutes,
--   drop column if exists maximum_booking_horizon_days,
--   drop column if exists slot_interval_minutes;
-- commit;
