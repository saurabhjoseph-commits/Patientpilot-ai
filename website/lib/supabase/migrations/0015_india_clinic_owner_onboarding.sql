-- REVIEW-ONLY. Do not execute automatically.
begin;

create table public.clinic_owner_onboarding (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  auth_user_id uuid null references auth.users(id),
  owner_email text not null,
  owner_full_name text not null,
  role text not null check (role in ('owner', 'manager')),
  status text not null check (status in ('pending', 'inviting', 'invited', 'active', 'failed', 'cancelled')),
  invitation_sent_at timestamptz null,
  activation_completed_at timestamptz null,
  last_attempt_at timestamptz null,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  failure_code text null check (failure_code is null or char_length(failure_code) <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clinic_owner_onboarding_clinic_id_idx on public.clinic_owner_onboarding(clinic_id);
create index clinic_owner_onboarding_owner_email_idx on public.clinic_owner_onboarding(lower(owner_email));
create index clinic_owner_onboarding_status_idx on public.clinic_owner_onboarding(status);
create index clinic_owner_onboarding_created_at_idx on public.clinic_owner_onboarding(created_at);
create unique index clinic_owner_onboarding_active_clinic_email_key on public.clinic_owner_onboarding(clinic_id, lower(owner_email)) where status in ('pending', 'inviting', 'invited', 'active');

alter table public.clinic_owner_onboarding enable row level security;
-- No browser policies. Server-side service-role operations are the only supported access path.
commit;

-- Read-only verification:
-- select tablename, policyname from pg_policies where schemaname = 'public' and tablename = 'clinic_owner_onboarding';
-- select indexname from pg_indexes where schemaname = 'public' and tablename = 'clinic_owner_onboarding';
-- select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.clinic_owner_onboarding'::regclass;

-- Rollback (only before any onboarding rows are intentionally retained):
-- drop table public.clinic_owner_onboarding;
