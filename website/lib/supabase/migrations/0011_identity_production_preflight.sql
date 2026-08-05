-- REVIEW-ONLY / READ-ONLY. Run manually before any Identity migration.
-- Fails the manual review if the production audit is no longer accurate.
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('users', 'user_credentials', 'user_sessions', 'roles', 'role_assignments')
order by table_name;

-- Required dependency evidence. Identity runtime currently requires tenant_id,
-- but the production audit has no authoritative tenants table or tenant FK.
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('clinics', 'tenants')
order by table_name;

select table_name, column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in ('clinics', 'users', 'user_credentials', 'user_sessions', 'roles', 'role_assignments')
order by table_name, ordinal_position;
