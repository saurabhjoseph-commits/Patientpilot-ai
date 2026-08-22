# India production launch checklist

This is a release gate, not an execution script. Record an owner, timestamp, evidence link, and PASS/BLOCKED result for every item. Never paste credentials or patient data into the release record.

## Environment isolation

- [ ] Development, staging, and production use distinct application origins.
- [ ] Staging and production use distinct Supabase projects and keys.
- [ ] Staging and production use distinct durable-session signing secrets.
- [ ] Staging and production use separate Twilio credentials/numbers or approved isolated subaccounts.
- [ ] Public intake, telephony routing, and handoff maps reference only the target environment.
- [ ] Only intentionally public values use `NEXT_PUBLIC_`; all service and signing credentials remain server-only.

## Build and deployment

- [ ] `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` pass from the release commit.
- [ ] Vercel project root is `website`, framework is Next.js, and the production branch is explicit.
- [ ] Preview uses staging variables; production variables are scoped only to Production.
- [ ] Application and Twilio webhook base URLs are exact HTTPS origins, not Vercel fallback hosts.
- [ ] Custom-domain DNS, TLS, redirects, and Supabase Auth URLs are verified.
- [ ] `GET /api/health` returns 200 and `GET /api/ready` returns 200; 503 blocks promotion.
- [ ] Daily authenticated webhook-delivery cleanup is configured and observed succeeding.

## Database gates (mandatory order)

- [ ] Back up the database and record a tested restore/rollback owner.
- [ ] Run the read-only preflight for migration 0024; resolve every ambiguous, unowned, or cross-clinic patient. Do not apply from this checklist.
- [ ] Apply 0024 in staging through the approved operator/process and retain verification evidence.
- [ ] Run the read-only preflight for migration 0025; resolve every unowned call summary or AI action. Do not apply from this checklist.
- [ ] Apply 0025 in staging through the approved operator/process and retain verification evidence.
- [ ] Clinic A accepts patient, call, summary, AI action, appointment, ownership, and clinical-linkage persistence.
- [ ] Clinic B independently accepts the same workflow.
- [ ] Cross-clinic reads/mutations fail and missing ownership fails closed.
- [ ] Repeat the reviewed 0024/0025 procedure in production only after staging sign-off.

## India and bilingual configuration

- [ ] Timezone is `Asia/Kolkata`; clinic hours, holidays, leave, durations, buffers, and date boundaries are accepted.
- [ ] Clinic A/B services, doctors, schedules, rooms, assignments, and booking policies are ready.
- [ ] English and Hindi are enabled; Hinglish behavior, pronunciation, fallback, and escalation wording are accepted.
- [ ] India numbers use normalized E.164 `+91` routing and match trusted destination maps exactly.
- [ ] Handoff, consent, recording/retention, notices, and data handling have India legal/privacy approval, including applicable DPDP and telecom requirements.

## Twilio and real-call acceptance

- [ ] Twilio account, auth, and phone variables are present and rotation ownership is recorded.
- [ ] Voice uses `/api/twilio/voice`, status uses `/api/twilio/status`, and gather continuation uses `/api/ai/respond` on the exact configured origin.
- [ ] Valid signatures succeed; invalid signatures and unmapped destinations fail; duplicates cause no duplicate side effects.
- [ ] Phone routing and open/closed-hours handoff reach the intended India clinic/number.
- [ ] One real English call completes and its transcript/summary is accepted.
- [ ] One real Hindi call completes and its transcript/summary is accepted.
- [ ] One real Hinglish call completes and its transcript/summary is accepted.
- [ ] Appointment persistence survives a new session, authenticated dashboard reload, and server restart/redeploy.
- [ ] Durable sessions pass sign-in, refresh, recovery/change, expiry, revocation, secure-cookie, and restart/redeploy tests.

## Monitoring and rollback

- [ ] Structured logs include correlation IDs, environment, route, status, and safe error codes without secrets, signatures, raw medical content, or unnecessary personal data.
- [ ] Alerts cover readiness, webhook errors, provider/database failures, persistence failures, cleanup failures, and latency.
- [ ] On-call owners, dashboards, retention/access controls, escalation contacts, and launch observation window are recorded.
- [ ] The last known-good application deployment is identified and schema-compatible after 0024/0025.
- [ ] Database rollback is separately reviewed; after new clinic-owned writes, prefer forward repair.
- [ ] Twilio rollback restores prior webhook routing without deleting numbers or losing callbacks.
- [ ] Release engineering, database owner, Clinic A/B, telephony, security/privacy, and product sign go/no-go.
