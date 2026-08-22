# PatientPilot India release gate

Date: 2026-08-20. Automated checks are fixture/runtime/source-contract checks, never live infrastructure claims.

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

- P0 open: TypeScript and production build fail because the new durable AI session API is asynchronous and clinic-scoped while callers still use the prior synchronous call-ID-only contract. Concurrent after-hours onboarding changes also reference a missing payload field, and a clinic edit language setter widens the validated mode to `string`.
- P1 fixed: speech/status callbacks did not bind `CallSid` to the resolved clinic before state mutation; both now verify durable ownership.
- P1 open: caller rescheduling, cancellation, authoritative pricing/insurance, and human handoff are not end-to-end proven. Implement/validate them or route/disable them for launch.
- P2: Hindi/Hinglish naturalness, ASR accuracy, emergency scripts, latency, disconnect cleanup, and database concurrency need staging/pilot evidence.
- P3: expand the noise/accent/adversarial multilingual corpus.

## Decision

**BLOCKED.** Tests must pass on the final shared baseline, TypeScript/build must pass, and P0/P1 items must close or leave launch scope.
