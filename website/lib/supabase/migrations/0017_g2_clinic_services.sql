-- G2 REVIEW-ONLY / MANUAL EXECUTION REQUIRED.
--
-- Approved clinic-scoped service catalog. This file does not create browser
-- access policies: service-role/server access remains the only access path
-- until an explicit RLS policy review is approved.

begin;

create table public.clinic_services (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null,
  name text not null,
  code text,
  description text,
  category text,
  default_duration_minutes integer not null,
  default_price numeric,
  currency text,
  active boolean not null default true,
  emergency boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clinic_services_clinic_id_fkey
    foreign key (clinic_id) references public.clinics(id)
    on update no action on delete cascade,
  constraint clinic_services_name_not_blank
    check (length(btrim(name)) > 0),
  constraint clinic_services_duration_positive
    check (default_duration_minutes > 0),
  constraint clinic_services_price_nonnegative
    check (default_price is null or default_price >= 0),
  constraint clinic_services_id_clinic_id_key unique (id, clinic_id)
);

create unique index clinic_services_clinic_name_key
  on public.clinic_services (clinic_id, lower(name));

create unique index clinic_services_clinic_code_key
  on public.clinic_services (clinic_id, code)
  where code is not null;

create index clinic_services_clinic_active_idx
  on public.clinic_services (clinic_id, active);

alter table public.clinic_services enable row level security;

commit;

-- Optional seed values must be reviewed and applied separately. No default
-- service rows are inserted by this schema migration.
