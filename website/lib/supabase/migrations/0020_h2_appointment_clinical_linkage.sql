-- H2.1 REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
-- Do not execute automatically. This package preserves all existing appointments.
-- It fails closed unless the verified G2/G3/G4 composite-key contracts exist.

begin;

do $$
begin
  if to_regclass('public.appointments') is null
    or to_regclass('public.doctors') is null
    or to_regclass('public.clinic_services') is null
    or to_regclass('public.clinic_rooms') is null
    or to_regclass('public.profiles') is null then
    raise exception 'H2.1 blocked: required appointment, doctor, service, room, or profile table is missing';
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name = 'clinic_id') then
    raise exception 'H2.1 blocked: public.appointments.clinic_id is missing';
  end if;

  if not exists (select 1 from pg_constraint where conrelid = 'public.doctors'::regclass and contype = 'u' and pg_get_constraintdef(oid) like '%UNIQUE (id, clinic_id)%')
    or not exists (select 1 from pg_constraint where conrelid = 'public.clinic_services'::regclass and contype = 'u' and pg_get_constraintdef(oid) like '%UNIQUE (id, clinic_id)%')
    or not exists (select 1 from pg_constraint where conrelid = 'public.clinic_rooms'::regclass and contype = 'u' and pg_get_constraintdef(oid) like '%UNIQUE (id, clinic_id)%') then
    raise exception 'H2.1 blocked: required clinic-scoped composite unique keys are missing';
  end if;

  -- Doctor identity cannot be reconciled until the deployed profile role check
  -- accepts doctor. Known prior production export accepts dentist, not doctor.
  if not exists (select 1 from pg_constraint where conrelid = 'public.profiles'::regclass and contype = 'c' and pg_get_constraintdef(oid) like '%''doctor''%') then
    raise exception 'H2.1 blocked: profiles.role does not accept doctor; approve a separate role-constraint migration first';
  end if;
end
$$;

alter table public.appointments
  add column if not exists doctor_id uuid null,
  add column if not exists service_id uuid null,
  add column if not exists room_id uuid null,
  add column if not exists duration_minutes integer null,
  add column if not exists checked_in_at timestamptz null,
  add column if not exists completed_at timestamptz null;

alter table public.appointments
  add constraint appointments_duration_minutes_positive check (duration_minutes is null or duration_minutes > 0),
  add constraint appointments_completed_after_checked_in check (completed_at is null or checked_in_at is null or completed_at >= checked_in_at),
  add constraint appointments_doctor_clinic_fkey foreign key (doctor_id, clinic_id) references public.doctors(id, clinic_id) on update no action on delete restrict,
  add constraint appointments_service_clinic_fkey foreign key (service_id, clinic_id) references public.clinic_services(id, clinic_id) on update no action on delete restrict,
  add constraint appointments_room_clinic_fkey foreign key (room_id, clinic_id) references public.clinic_rooms(id, clinic_id) on update no action on delete restrict;

create index appointments_clinic_date_idx on public.appointments (clinic_id, appointment_date, appointment_time);
create index appointments_clinic_doctor_date_idx on public.appointments (clinic_id, doctor_id, appointment_date) where doctor_id is not null;
create index appointments_clinic_service_date_idx on public.appointments (clinic_id, service_id, appointment_date) where service_id is not null;
create index appointments_clinic_room_date_idx on public.appointments (clinic_id, room_id, appointment_date) where room_id is not null;

commit;

-- POST-EXECUTION VERIFICATION (run manually after a successful commit):
-- select column_name, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'appointments' and column_name in ('doctor_id','service_id','room_id','duration_minutes','checked_in_at','completed_at') order by column_name;
-- select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.appointments'::regclass and conname like 'appointments_%_clinic_fkey' or conname in ('appointments_duration_minutes_positive','appointments_completed_after_checked_in') order by conname;
-- select indexname, indexdef from pg_indexes where schemaname = 'public' and tablename = 'appointments' and indexname like 'appointments_clinic_%' order by indexname;

-- ROLLBACK (manual, only after verifying no application has written these fields):
-- begin;
-- alter table public.appointments drop constraint if exists appointments_doctor_clinic_fkey, drop constraint if exists appointments_service_clinic_fkey, drop constraint if exists appointments_room_clinic_fkey, drop constraint if exists appointments_duration_minutes_positive, drop constraint if exists appointments_completed_after_checked_in;
-- drop index if exists public.appointments_clinic_date_idx, public.appointments_clinic_doctor_date_idx, public.appointments_clinic_service_date_idx, public.appointments_clinic_room_date_idx;
-- alter table public.appointments drop column if exists doctor_id, drop column if exists service_id, drop column if exists room_id, drop column if exists duration_minutes, drop column if exists checked_in_at, drop column if exists completed_at;
-- commit;
