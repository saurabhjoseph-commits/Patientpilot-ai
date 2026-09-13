# PatientPilot India release gate

Date: 2026-09-13. Automated checks are fixture/runtime/source-contract checks, never live infrastructure claims.

| Area | Automated evidence | Live validation required |
| --- | --- | --- |
| Authentication | Recovery/reset, logout revocation, protected shell | Supabase email, expiry, staging login/logout |
| Tenant isolation | Two-clinic fixtures, scoped repositories, callback CallSid ownership | Two real clinics against staging RLS/service roles |
| Clinic onboarding | India defaults, invite/readiness contracts | Fresh clinic, invite, first login, persisted readiness |
| Patients / leads | Clinic-owned writes and parent checks | Staging CRUD and inbound lead |
| Appointments | Create/edit/linkage/lifecycle/calendar fixtures | Persistence and concurrent booking |
| Calls / transcripts | Verified clinic-owned parent contracts | Real carrier call and transcript persistence |
| AI summaries/actions | Parent ownership and strict schemas | Model quality, safety, latency, persistence |
| English / Hindi / Hinglish / switching | Detection, intents, extraction, state contracts | Voice recognition/synthesis and accents |
| Booking | Confirmed fixture, readiness, authoritative availability | Carrier-to-database booking |
| Rescheduling / cancellation | Intent plus admin lifecycle fixtures | Caller identity and end-to-end AI mutation |
| Office hours / pricing / insurance | Intent and no-invention/context contracts | Authoritative spoken answers |
| Pain/emergency | Urgency intent and no-diagnosis prompt | Clinician-approved scripts/simulation |
| Human handoff | Intent classification | Transfer, fallback and consent |
| Silence / bad input / disconnect | Re-prompt, fallback, terminal status paths | Carrier timing, noise, mid-turn cleanup |
| API authorization | Server identity/permission/scope contracts | Real session/RLS role matrix |
| Webhook security | Signature, HTTPS URL, replay claim, CallSid ownership | Signed callbacks behind production proxy |

## Findings

- RC6 automated gate: 197/197 automated tests pass, TypeScript passes, and lint passes with zero errors.
- P0 fixed: durable clinic-scoped AI sessions now use the asynchronous, clinic-owned contract; the former call-ID-only boundary is not the release blocker.
- P1 fixed: speech/status callbacks did not bind `CallSid` to the resolved clinic before state mutation; both now verify durable ownership.
- P1 open: `/api/ready` must return 200 in staging. It is currently blocked by `TELEPHONY_CLINIC_PHONE_MAP`, which requires a staging-only number; never reuse a production number to satisfy this gate.
- P1 open: migrations `0024` and `0025` still require staging certification with the two-clinic isolation harness.
- P1 open: caller rescheduling, cancellation, authoritative pricing/insurance, and human handoff are not end-to-end proven. Implement/validate them or route/disable them for launch.
- P2: real English, Hindi, and Hinglish calls still require staging/pilot validation for recognition, synthesis, accents, emergency scripts, latency, and disconnect cleanup.
- P3: expand the noise/accent/adversarial multilingual corpus.

## Decision

**BLOCKED ON LIVE STAGING EVIDENCE.** Automated checks pass, but launch requires `/api/ready` = 200, a staging-only telephony map, migration `0024`/`0025` certification, and real English, Hindi, and Hinglish call validation. Do not treat this document as evidence of production deployment or production database readiness.
