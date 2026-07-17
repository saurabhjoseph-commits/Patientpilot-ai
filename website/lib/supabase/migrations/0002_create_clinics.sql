create table if not exists public.clinics (
    id uuid primary key default gen_random_uuid(),

    slug text not null unique,
    name text not null,

    status text not null default 'trial'
        check (status in ('trial','active','inactive','suspended')),

    email text not null,
    phone text not null,
    website text,

    country text not null,
    timezone text not null,
    currency text not null,

    logo_url text,

    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_clinics_slug
on public.clinics(slug);

create index if not exists idx_clinics_status
on public.clinics(status);

create trigger trg_clinics_updated_at
before update on public.clinics
for each row
execute function set_updated_at();