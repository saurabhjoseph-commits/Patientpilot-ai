-- REVIEW-ONLY: do not apply automatically.
-- The runtime derives permissions from public.roles.permissions through active role_assignments.
-- Run the SELECT first in the Supabase SQL Editor, review tenant-scoped custom roles,
-- then run the UPDATE manually only if these system role records exist and are intended
-- to match DefaultRolePolicies.

select id, tenant_id, clinic_id, code, permissions
from public.roles
where code in ('super-admin', 'clinic-owner', 'administrator', 'practice-manager')
order by tenant_id, clinic_id nulls first, code;

-- Manual reconciliation (intentionally commented out):
-- update public.roles
-- set permissions = array(
--   select distinct permission
--   from unnest(coalesce(permissions, '{}'::text[]) || case
--     when code in ('super-admin', 'clinic-owner', 'administrator') then array['clinic.read', 'clinic.update']::text[]
--     when code = 'practice-manager' then array['clinic.read']::text[]
--     else '{}'::text[]
--   end) as permission
--   order by permission
-- )
-- where code in ('super-admin', 'clinic-owner', 'administrator', 'practice-manager');
