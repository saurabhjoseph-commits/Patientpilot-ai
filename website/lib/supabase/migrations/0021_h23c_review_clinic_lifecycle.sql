-- REVIEW ONLY — DO NOT APPLY without schema approval and a production rollback plan.
-- H2.3C has no verified clinics lifecycle column, so permanent deletion remains
-- dependency-free only. This optional proposal enables future safe deactivation.
begin;

alter table public.clinics
  add column if not exists is_active boolean not null default true;

create index if not exists idx_clinics_active on public.clinics (is_active);

commit;

-- Rollback (only after confirming no application code depends on the column):
-- begin;
-- drop index if exists public.idx_clinics_active;
-- alter table public.clinics drop column if exists is_active;
-- commit;
