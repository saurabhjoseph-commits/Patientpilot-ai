-- REVIEW ONLY — DO NOT APPLY automatically.
-- This ledger intentionally has no clinic FK: notification retries happen after deletion.
begin;

create table public.clinic_deletion_notifications (
  id uuid primary key default gen_random_uuid(),
  clinic_name text not null,
  owner_name text null,
  owner_email text not null,
  status text not null check (status in ('pending', 'sent', 'failed')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  failure_code text null check (failure_code is null or char_length(failure_code) <= 100),
  sent_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clinic_deletion_notifications_status_idx on public.clinic_deletion_notifications (status, created_at desc);
alter table public.clinic_deletion_notifications enable row level security;
-- No browser policy. Server-side service-role routes only.
commit;

-- Rollback: drop table public.clinic_deletion_notifications;
