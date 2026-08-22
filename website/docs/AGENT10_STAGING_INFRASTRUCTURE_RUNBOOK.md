# Agent 10 staging infrastructure runbook

This procedure is staging-only. Do not run it against the production Supabase
project (`tkhkjeoqslirriqinxxb`) or route a production clinic number to staging.

## 1. Create an isolated HTTPS deployment

1. In Vercel, create or select a non-production project/environment for this
   repository. Use a dedicated staging branch and disable automatic production
   promotion.
2. Assign `staging.patientpilot-ai.com`, or retain a stable Vercel staging
   hostname. Do not alter the production domain.
3. Set `NEXT_PUBLIC_APP_URL` and `TWILIO_WEBHOOK_BASE_URL` to the same HTTPS
   origin, without a path, query, or trailing application route.
4. Deploy and require successful responses from `/api/health` and `/api/ready`.
   Confirm that `/api/twilio/voice`, `/api/twilio/status`, and `/api/ai/respond`
   are reachable at that origin; do not make a live call during this check.

## 2. Staging runtime configuration

Required for the complete India staging application:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (`OPENAI_MODEL` is optional)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `TWILIO_WEBHOOK_BASE_URL`
- `TELEPHONY_CLINIC_PHONE_MAP`
- `PUBLIC_INTAKE_CLINIC_ID`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `WEBHOOK_CLEANUP_CRON_SECRET`

Feature-specific:

- `TELEPHONY_HANDOFF_PHONE_MAP` is required only to exercise human handoff or
  emergency transfer. Without it, the voice flow must fail safely rather than
  invent a destination.
- Transactional email variables are required only for owner invitation,
  deletion notification, or password-recovery delivery.

Legacy/unused by the current runtime: `JWT_SECRET`, `SESSION_SECRET`, and
`NEXTAUTH_SECRET`.

The staging Supabase URL must resolve to project `tgpcgyuujaklgepknucd`.
Staging may initially share an OpenAI credential, but its Supabase project and
application origin must remain isolated. A shared Twilio account is acceptable
only with a dedicated staging number; the destination-number mapping must
contain staging clinic UUIDs only. Never map a production clinic number to the
staging webhook.

## 3. Apply the reviewed migrations

Sign in to the Supabase dashboard, visibly select project
`tgpcgyuujaklgepknucd`, and verify the project URL again immediately before SQL
execution. Use the dashboard SQL editor or the repository's established
migration runner when one becomes available. Do not use a REST service-role
client as a substitute for a DDL runner.

Run each complete file separately and stop on the first error:

1. `0024_agent1_patient_clinic_isolation_review.sql`
2. `0025_agent1_call_owned_isolation_review.sql`
3. `0026_agent5_durable_conversation_sessions_review.sql`
4. `0027_agent4_clinic_onboarding_emergency_settings.sql`

Do not remove their fail-closed checks. After each file, verify its columns,
nullability, foreign keys, composite consistency constraints, indexes, RLS, and
RPC signature against the requirements in the Agent 10 brief. Record only
schema metadata and row counts—never patient or transcript content.

## 4. Acceptance sequence

Only after all four migrations pass:

1. Execute `docs/database-audit/AGENT1_CLINIC_ISOLATION_ACCEPTANCE.md` with two
   disposable clinics and synthetic data, including both-direction read,
   update, delete, and cross-clinic `CallSid` denial checks.
2. Certify durable active, completed, expired, and cross-clinic session behavior.
3. Create a disposable India clinic using `Asia/Kolkata`, `bilingual-auto`, and
   INR where applicable; configure service, provider, schedule, greeting,
   handoff, and emergency rules, then verify readiness.
4. If an isolated staging redeploy exists, verify session restoration across
   redeploy. Otherwise record that check as pending.
5. Run `npm test`, `npm run typecheck`, `npm run build`, and `npm run lint` from
   `website/` and retain their exact exit status.

