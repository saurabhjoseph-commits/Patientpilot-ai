-- G4 REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
-- Depends on 0018_g3_doctors.sql. No browser RLS policies are created.

begin;

create table public.clinic_rooms (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null,
  name text not null,
  code text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clinic_rooms_clinic_id_fkey
    foreign key (clinic_id) references public.clinics(id)
    on update no action on delete cascade,
  constraint clinic_rooms_name_not_blank check (length(btrim(name)) > 0),
  constraint clinic_rooms_id_clinic_id_key unique (id, clinic_id)
);

create unique index clinic_rooms_clinic_name_key on public.clinic_rooms (clinic_id, lower(name));
create unique index clinic_rooms_clinic_code_key on public.clinic_rooms (clinic_id, code) where code is not null;

create table public.doctor_schedules (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null,
  doctor_id uuid not null,
  weekday smallint not null,
  start_time time not null,
  end_time time not null,
  break_start_time time,
  break_end_time time,
  effective_from date,
  effective_to date,
  timezone text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint doctor_schedules_doctor_clinic_fkey
    foreign key (doctor_id, clinic_id) references public.doctors(id, clinic_id)
    on update no action on delete cascade,
  constraint doctor_schedules_weekday_range check (weekday between 0 and 6),
  constraint doctor_schedules_time_range check (start_time < end_time),
  constraint doctor_schedules_break_range check (
    (break_start_time is null and break_end_time is null) or
    (break_start_time is not null and break_end_time is not null and start_time < break_start_time and break_start_time < break_end_time and break_end_time < end_time)
  ),
  constraint doctor_schedules_effective_range check (effective_to is null or effective_from is null or effective_from <= effective_to)
);

create index doctor_schedules_clinic_doctor_idx on public.doctor_schedules (clinic_id, doctor_id, weekday) where active;

create table public.doctor_leave (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null,
  doctor_id uuid not null,
  starts_on date not null,
  ends_on date not null,
  reason text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint doctor_leave_doctor_clinic_fkey
    foreign key (doctor_id, clinic_id) references public.doctors(id, clinic_id)
    on update no action on delete cascade,
  constraint doctor_leave_date_range check (starts_on <= ends_on)
);

create index doctor_leave_clinic_doctor_dates_idx on public.doctor_leave (clinic_id, doctor_id, starts_on, ends_on) where active;

create table public.doctor_room_assignments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null,
  doctor_id uuid not null,
  room_id uuid not null,
  effective_from date,
  effective_to date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint doctor_room_assignments_doctor_clinic_fkey
    foreign key (doctor_id, clinic_id) references public.doctors(id, clinic_id)
    on update no action on delete cascade,
  constraint doctor_room_assignments_room_clinic_fkey
    foreign key (room_id, clinic_id) references public.clinic_rooms(id, clinic_id)
    on update no action on delete cascade,
  constraint doctor_room_assignments_effective_range check (effective_to is null or effective_from is null or effective_from <= effective_to)
);

create index doctor_room_assignments_clinic_doctor_idx on public.doctor_room_assignments (clinic_id, doctor_id) where active;
create index doctor_room_assignments_clinic_room_idx on public.doctor_room_assignments (clinic_id, room_id) where active;

create table public.blocked_time (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null,
  doctor_id uuid,
  room_id uuid,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  source text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blocked_time_clinic_id_fkey
    foreign key (clinic_id) references public.clinics(id)
    on update no action on delete cascade,
  constraint blocked_time_doctor_clinic_fkey
    foreign key (doctor_id, clinic_id) references public.doctors(id, clinic_id)
    on update no action on delete cascade,
  constraint blocked_time_room_clinic_fkey
    foreign key (room_id, clinic_id) references public.clinic_rooms(id, clinic_id)
    on update no action on delete cascade,
  constraint blocked_time_range check (starts_at < ends_at),
  constraint blocked_time_target check (doctor_id is not null or room_id is not null)
);

create index blocked_time_clinic_dates_idx on public.blocked_time (clinic_id, starts_at, ends_at) where active;
create index blocked_time_doctor_dates_idx on public.blocked_time (doctor_id, starts_at, ends_at) where active and doctor_id is not null;
create index blocked_time_room_dates_idx on public.blocked_time (room_id, starts_at, ends_at) where active and room_id is not null;

alter table public.clinic_rooms enable row level security;
alter table public.doctor_schedules enable row level security;
alter table public.doctor_leave enable row level security;
alter table public.doctor_room_assignments enable row level security;
alter table public.blocked_time enable row level security;

commit;
