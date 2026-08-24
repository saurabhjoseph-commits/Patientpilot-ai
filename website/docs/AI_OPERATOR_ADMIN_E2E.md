# AI Operator and Admin E2E

## Purpose

`ai_operator` is a dedicated Supabase profile role for automated staging certification. It is not `super_admin`, does not inherit administrator permissions, and always uses the authenticated profile and server-derived clinic context.

## Permissions

The default role is read-only: dashboard, clinics, leads, patients, appointments, calls, AI status, analytics, settings, providers, calendars, schedules, leave, rooms, and audit status. It never receives billing, user-role management, global doctor management, clinic deletion, patient deletion, secret management, or generic clinic-setting write permissions.

Staging test writes are separate permissions. They are added only when the server has both `AI_OPERATOR_STAGING_GLOBAL_ENABLED=true` and a trusted staging signal (`VERCEL_ENV=preview`, `APP_ENV=staging`, or `E2E_TARGET=staging`). `VERCEL_ENV=production` always disables them. Browser input cannot enable this mode.

## Scope and synthetic data

Every operator has an anchor `clinic_id`. Without the staging-global permission, normal clinic isolation applies. With it, the operator may inspect explicitly selected staging clinics for certification. Migration `0028_agent12_ai_operator_test_data_review.sql` adds `is_test` to clinics, leads, patients, and appointments. A mutable E2E row must have `is_test=true` and the source `agent12-e2e` (or the clinic name prefix `[E2E] `). Untagged rows are immutable to AI Operator cleanup. The migration is review-only and must not be applied automatically.

## Execution modes

Run the repository harness with `npm run test:e2e:admin`. It covers role policy, Clinic A/B isolation, cross-clinic direct access denial, staging-global reads, tagged creation/cleanup, production guards, and secret hygiene.

Live staging execution must set `E2E_TARGET=staging`, a non-production `E2E_BASE_URL`, and `E2E_ALLOW_STAGING_WRITES=true` for explicitly tagged writes. The safety policy rejects writes to `patientpilot-ai.com` and `www.patientpilot-ai.com` regardless of overrides.

Production smoke mode is read-only. It may verify login reachability, dashboard/navigation, expected page status, and clinic isolation. It must not create, edit, delete, call, configure, invite, bill, or clean data.

## Bootstrap

After migration review and staging application, create `ai-operator-staging@<controlled-domain>` through Supabase Auth or the existing controlled user flow. Insert or update its `public.profiles` row with `role='ai_operator'` and a staging anchor `clinic_id`. Never store the password in source, documentation, shell history, fixtures, or CI logs. Provide it through the approved staging secret store only. Do not create this identity in Production.

## Operator procedure

Alex or other AI tooling should first run the local policy harness, then authenticate through the normal staging login. It must record only statuses and record IDs, never cookies, tokens, transcripts, patient content, or secret values. Cleanup must target IDs created in the same run and re-check both `is_test=true` and the source marker.

## Emergency disable

Set `AI_OPERATOR_STAGING_GLOBAL_ENABLED=false` (or remove it) in Preview only, then redeploy Preview. For immediate identity revocation, disable or delete the staging Auth user and revoke its sessions. Do not change Production configuration. Existing synthetic rows remain tagged for supervised cleanup.

## Current dependency

The live browser/API run depends on a functioning `/api/auth/sign-in`. If RC2 authentication still returns 500, retain this harness and execute it after the separate auth-recovery release is validated. The harness does not bypass authentication.
