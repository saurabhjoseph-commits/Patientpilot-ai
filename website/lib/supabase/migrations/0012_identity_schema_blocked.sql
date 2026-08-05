-- REVIEW-ONLY: INTENTIONALLY NOT EXECUTABLE.
-- Do not apply this file. It records the migration dependency order and stops
-- implementation until an authoritative Identity/tenant schema export exists.
--
-- Required order after authoritative approval:
-- 1. users (repository/mapper require id, tenant_id, clinic_id, full_name,
--    email, status, auth_provider, email_verified, last_login_at, created_at,
--    updated_at)
-- 2. user_credentials (id, user_id, auth_provider, password_hash,
--    failed_login_attempts, locked_until, password_changed_at, timestamps)
-- 3. user_sessions (id, user_id, refresh_token_id, status, IP/device fields,
--    activity/expiry/revocation timestamps)
-- 4. roles (id, tenant_id, clinic_id as used by repository writes, code, name,
--    description, permissions, is_system, is_active, timestamps)
-- 5. role_assignments (id, tenant_id, clinic_id, user_id, role_id,
--    assignment/revocation fields, timestamps)
-- 6. verified constraints/indexes, system roles, admin backfill, role assignment,
--    permission reconciliation, validation.
--
-- Supabase auth.users is NOT a replacement for public.users: the application
-- validates password_hash in public.user_credentials and issues its own sessions.
-- Any mapping from auth.users must be approved by an authoritative export and
-- must use auth.users.id only when it matches the intended public.users.id.
do $$
begin
  raise exception 'Identity production migration blocked: authoritative users/roles/tenant schema is missing. Do not invent columns or foreign keys.';
end $$;
