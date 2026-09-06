-- Demo-request email outbox. Independent of the review-only Agent 12 migration 0028.
begin;

create table public.demo_request_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on update no action on delete restrict,
  lead_id bigint not null references public.contacts(id) on update no action on delete cascade,
  kind text not null check (kind in ('customer_acknowledgement', 'team_notification')),
  recipient_email text not null,
  status text not null default 'pending' check (status in ('pending', 'sending', 'accepted', 'delivered', 'failed', 'bounced', 'complained', 'suppressed')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  provider_message_id text null,
  failure_code text null check (failure_code is null or char_length(failure_code) <= 100),
  next_attempt_at timestamptz not null default now(),
  last_attempt_at timestamptz null,
  accepted_at timestamptz null,
  delivered_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lead_id, kind),
  unique (provider_message_id),
  unique (id, clinic_id)
);

create index demo_request_email_retry_idx
  on public.demo_request_email_deliveries (next_attempt_at, id)
  where status in ('pending', 'failed');
create index demo_request_email_clinic_idx
  on public.demo_request_email_deliveries (clinic_id, created_at desc);

create table public.demo_request_email_events (
  provider_event_id text primary key,
  event_type text not null,
  received_at timestamptz not null default now()
);

alter table public.demo_request_email_deliveries enable row level security;
alter table public.demo_request_email_events enable row level security;
-- No browser policy. The server-side service role owns enqueue, delivery, and retry.
revoke all on public.demo_request_email_deliveries from anon, authenticated;
revoke all on public.demo_request_email_events from anon, authenticated;
revoke all on public.demo_request_email_deliveries from service_role;
revoke all on public.demo_request_email_events from service_role;
grant select, insert, update on public.demo_request_email_deliveries to service_role;
grant select, insert on public.demo_request_email_events to service_role;

create function public.enqueue_demo_request_emails()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  insert into public.demo_request_email_deliveries (clinic_id, lead_id, kind, recipient_email)
  values
    (new.clinic_id, new.id, 'customer_acknowledgement', new.email),
    (new.clinic_id, new.id, 'team_notification', 'support@patientpilot-ai.com')
  on conflict (lead_id, kind) do nothing;
  return new;
end;
$$;

create trigger contacts_enqueue_demo_request_emails
after insert on public.contacts
for each row execute function public.enqueue_demo_request_emails();

commit;

-- Rollback: drop trigger contacts_enqueue_demo_request_emails on public.contacts; drop function public.enqueue_demo_request_emails(); drop table public.demo_request_email_events; drop table public.demo_request_email_deliveries;
