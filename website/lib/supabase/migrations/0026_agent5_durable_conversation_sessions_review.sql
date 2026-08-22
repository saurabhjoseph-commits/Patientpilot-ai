-- REVIEW ONLY. Apply after review and migrations 0024/0025.
begin;
create table if not exists public.conversation_sessions (
 id uuid primary key default gen_random_uuid(), clinic_id uuid not null references public.clinics(id) on delete cascade,
 call_sid text not null, status text not null default 'active' check (status in ('active','completed','expired','transferred')),
 conversation_state text not null, appointment_state jsonb not null default '{}'::jsonb, patient_state jsonb not null default '{}'::jsonb,
 language_mode text not null, current_language text not null, primary_language text not null, language_confidence numeric,
 code_switching boolean not null default false, confidence numeric not null default 1, session_data jsonb not null,
 started_at timestamptz not null default now(), updated_at timestamptz not null default now(), ended_at timestamptz,
 expires_at timestamptz not null default (now() + interval '24 hours'), unique (clinic_id, call_sid)
);
create index if not exists idx_conversation_sessions_active on public.conversation_sessions (clinic_id, call_sid) where status = 'active';
alter table public.conversation_sessions enable row level security;
-- Service-role runtime only: deliberately no browser/authenticated policy.
commit;
