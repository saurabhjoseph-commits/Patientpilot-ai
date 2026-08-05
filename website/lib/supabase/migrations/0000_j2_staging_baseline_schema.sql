-- REVIEW ONLY: staging baseline reconstructed solely from docs/database-audit exports.
-- Do not apply automatically. Run this before J.2 migrations 0003-0007 only in the confirmed staging project.
-- The exported gen_random_uuid() defaults require the Supabase-provided pgcrypto function.
-- Execute the complete file as one transaction in the Supabase SQL Editor.

begin;

create table public.clinics (
  id uuid not null default gen_random_uuid(),
  name text not null,
  slug text not null,
  email text,
  phone text,
  website text,
  address text,
  city text,
  state text,
  country text,
  timezone text default 'America/Chicago'::text,
  logo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint clinics_pkey primary key (id),
  constraint clinics_slug_key unique (slug)
);

create table public.contacts (
  id bigint not null,
  clinic_name text not null,
  dentist_name text not null,
  email text not null,
  phone text not null,
  monthly_calls text,
  message text,
  status text default 'New'::text,
  created_at timestamp with time zone default now(),
  clinic_id uuid,
  notes text,
  contacted_at timestamp with time zone,
  demo_date timestamp with time zone,
  converted boolean default false,
  updated_at timestamp with time zone default now(),
  constraint contacts_pkey primary key (id),
  constraint contacts_clinic_id_fkey foreign key (clinic_id) references public.clinics(id) on update no action on delete no action
);

create table public.patients (
  id uuid not null default gen_random_uuid(),
  clinic_name text not null,
  first_name text not null,
  last_name text not null,
  full_name text not null,
  phone_number text not null,
  email text,
  date_of_birth date,
  preferred_contact_method text,
  preferred_dentist text,
  notes text,
  status text not null default 'new'::text,
  total_appointments integer not null default 0,
  last_appointment_date date,
  last_call_date timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint patients_pkey primary key (id),
  constraint patients_preferred_contact_method_check check (preferred_contact_method = any (array['phone'::text, 'sms'::text, 'email'::text])),
  constraint patients_status_check check (status = any (array['new'::text, 'active'::text, 'inactive'::text]))
);

create table public.profiles (
  id uuid not null,
  clinic_id uuid,
  full_name text not null,
  role text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_clinic_id_fkey foreign key (clinic_id) references public.clinics(id) on update no action on delete cascade,
  constraint profiles_id_fkey foreign key (id) references auth.users(id) on delete cascade,
  constraint profiles_role_check check (role = any (array['super_admin'::text, 'owner'::text, 'manager'::text, 'receptionist'::text, 'dentist'::text]))
);

create table public.appointments (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  patient_name text not null,
  phone text,
  email text,
  service text not null,
  appointment_date text not null,
  appointment_time text not null,
  status text not null default 'Booked'::text,
  source text not null default 'AI Receptionist'::text,
  notes text,
  clinic_id uuid,
  constraint appointments_pkey primary key (id),
  constraint appointments_clinic_id_fkey foreign key (clinic_id) references public.clinics(id) on update no action on delete no action
);

create table public.calls (
  id uuid not null default gen_random_uuid(),
  call_sid text,
  patient_name text,
  phone text not null,
  status text default 'ringing'::text,
  ai_state text default 'listening'::text,
  started_at timestamp with time zone,
  answered_at timestamp with time zone,
  ended_at timestamp with time zone,
  duration_seconds integer default 0,
  recording_url text,
  transcript_summary text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  clinic_id uuid,
  constraint calls_pkey primary key (id),
  constraint calls_call_sid_key unique (call_sid),
  constraint calls_clinic_id_fkey foreign key (clinic_id) references public.clinics(id) on update no action on delete no action
);

create table public.call_messages (
  id uuid not null default gen_random_uuid(),
  call_id uuid,
  sender text not null,
  message text not null,
  created_at timestamp with time zone default now(),
  clinic_id uuid,
  constraint call_messages_pkey primary key (id),
  constraint call_messages_call_id_fkey foreign key (call_id) references public.calls(id) on update no action on delete cascade,
  constraint call_messages_clinic_id_fkey foreign key (clinic_id) references public.clinics(id) on update no action on delete no action
);

create table public.ai_actions (
  id uuid not null default gen_random_uuid(),
  call_id uuid,
  action text,
  details text,
  created_at timestamp with time zone default now(),
  constraint ai_actions_pkey primary key (id),
  constraint ai_actions_call_id_fkey foreign key (call_id) references public.calls(id) on update no action on delete no action
);

create table public.clinic_settings (
  id uuid not null default gen_random_uuid(),
  clinic_id uuid,
  ai_name text default 'Sarah'::text,
  greeting text,
  office_hours jsonb,
  services jsonb,
  faq jsonb,
  emergency_rules jsonb,
  scheduling_rules jsonb,
  voice text default 'alloy'::text,
  language text default 'en'::text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint clinic_settings_pkey primary key (id),
  constraint clinic_settings_clinic_id_key unique (clinic_id),
  constraint clinic_settings_clinic_id_fkey foreign key (clinic_id) references public.clinics(id) on update no action on delete cascade
);

create sequence public.lead_activity_id_seq;

create table public.lead_activity (
  id bigint not null default nextval('lead_activity_id_seq'::regclass),
  lead_id bigint not null,
  type text not null,
  description text not null,
  created_at timestamp with time zone default now(),
  constraint lead_activity_pkey primary key (id),
  constraint lead_activity_lead_id_fkey foreign key (lead_id) references public.contacts(id) on update no action on delete cascade
);

create table public.call_summaries (
  id uuid not null default gen_random_uuid(),
  call_sid text not null,
  clinic_name text not null,
  patient_name text,
  phone_number text,
  intent text not null,
  outcome text not null,
  summary text not null,
  action_items jsonb not null default '[]'::jsonb,
  appointment_id uuid,
  patient_id uuid,
  confidence numeric not null default 0.95,
  duration_seconds integer,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint call_summaries_pkey primary key (id),
  constraint call_summaries_call_sid_key unique (call_sid),
  constraint call_summaries_patient_id_fkey foreign key (patient_id) references public.patients(id) on update no action on delete set null,
  constraint call_summaries_outcome_check check (outcome = any (array['appointment_created'::text, 'appointment_requested'::text, 'rescheduled'::text, 'cancelled'::text, 'information_only'::text, 'transferred'::text, 'incomplete'::text, 'unknown'::text]))
);

create index idx_appointments_clinic on public.appointments using btree (clinic_id);
create index idx_messages_clinic on public.call_messages using btree (clinic_id);
create index idx_summaries_call_sid on public.call_summaries using btree (call_sid);
create index idx_summaries_created on public.call_summaries using btree (created_at desc);
create index idx_summaries_outcome on public.call_summaries using btree (outcome);
create index idx_summaries_patient on public.call_summaries using btree (patient_name);
create index idx_calls_clinic on public.calls using btree (clinic_id);
create index idx_contacts_clinic on public.contacts using btree (clinic_id);
create index idx_lead_activity_created on public.lead_activity using btree (created_at desc);
create index idx_lead_activity_lead on public.lead_activity using btree (lead_id);
create index idx_patients_clinic on public.patients using btree (clinic_name);
create index idx_patients_phone on public.patients using btree (phone_number);
create index idx_patients_status on public.patients using btree (status);

alter table public.ai_actions enable row level security;
alter table public.appointments enable row level security;
alter table public.call_messages enable row level security;
alter table public.call_summaries enable row level security;
alter table public.calls enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.clinics enable row level security;
alter table public.contacts enable row level security;
alter table public.lead_activity enable row level security;
alter table public.patients enable row level security;
alter table public.profiles enable row level security;

create policy "Allow service role full access - ai_actions" on public.ai_actions as permissive for all to public using (true) with check (true);
create policy "Allow all with service role" on public.appointments as permissive for all to public using (true) with check (true);
create policy "Allow service role full access - appointments" on public.appointments as permissive for all to public using (true) with check (true);
create policy "Allow service role full access - call_messages" on public.call_messages as permissive for all to public using (true) with check (true);
create policy "Authenticated read summaries" on public.call_summaries as permissive for select to authenticated using (true);
create policy "Service role full access summaries" on public.call_summaries as permissive for all to public using (true) with check (true);
create policy "Allow service role full access - calls" on public.calls as permissive for all to public using (true) with check (true);
create policy "Anyone can insert contacts" on public.contacts as permissive for insert to anon with check (true);
create policy "Authenticated users can view contacts" on public.contacts as permissive for select to authenticated using (true);
create policy "Authenticated read patients" on public.patients as permissive for select to authenticated using (true);
create policy "Service role full access patients" on public.patients as permissive for all to public using (true) with check (true);

commit;
