-- Enable UUID generation
create extension if not exists pgcrypto;

-- Automatically update updated_at
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;