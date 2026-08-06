-- G3 REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
-- Depends on 0017_g2_clinic_services.sql. No browser RLS policies are created.

begin;

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null,
  auth_user_id uuid,
  full_name text not null,
  email text not null,
  phone text,
  qualification text,
  specialisation text,
  registration_number text,
  languages text[] not null default '{}',
  profile_photo_url text,
  default_appointment_duration_minutes integer not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint doctors_clinic_id_fkey
    foreign key (clinic_id) references public.clinics(id)
    on update no action on delete cascade,
  constraint doctors_auth_user_id_fkey
    foreign key (auth_user_id) references auth.users(id)
    on update no action on delete set null,
  constraint doctors_full_name_not_blank check (length(btrim(full_name)) > 0),
  constraint doctors_email_not_blank check (length(btrim(email)) > 0),
  constraint doctors_duration_positive check (default_appointment_duration_minutes > 0),
  constraint doctors_id_clinic_id_key unique (id, clinic_id)
);

create unique index doctors_clinic_email_key on public.doctors (clinic_id, lower(email));
create unique index doctors_auth_user_id_key on public.doctors (auth_user_id) where auth_user_id is not null;
create index doctors_clinic_status_idx on public.doctors (clinic_id, status);

create table public.doctor_services (
  doctor_id uuid not null,
  service_id uuid not null,
  clinic_id uuid not null,
  active boolean not null default true,
  custom_duration_minutes integer,
  custom_price numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint doctor_services_pkey primary key (doctor_id, service_id),
  constraint doctor_services_doctor_clinic_fkey
    foreign key (doctor_id, clinic_id) references public.doctors(id, clinic_id)
    on update no action on delete cascade,
  constraint doctor_services_service_clinic_fkey
    foreign key (service_id, clinic_id) references public.clinic_services(id, clinic_id)
    on update no action on delete cascade,
  constraint doctor_services_duration_positive
    check (custom_duration_minutes is null or custom_duration_minutes > 0),
  constraint doctor_services_price_nonnegative
    check (custom_price is null or custom_price >= 0)
);

create index doctor_services_clinic_active_idx on public.doctor_services (clinic_id, active);
create index doctor_services_service_idx on public.doctor_services (service_id);

alter table public.doctors enable row level security;
alter table public.doctor_services enable row level security;

commit;
