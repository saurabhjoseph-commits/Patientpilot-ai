# Master Roadmap

## J.3 — Telephony Webhook Security

Completed in application code: signed Twilio webhook verification, proxy-safe public URL construction, trusted clinic mapping after verification, duplicate-delivery handling, and retirement of the unsigned legacy route.

Production gate: configure the trusted webhook origin, run provider callback and duplicate-delivery smoke tests, and introduce durable replay-event storage before multi-instance or high-volume telephony rollout.

## J.3.1 — Durable Webhook Idempotency

Completed in code and reviewable SQL: durable verified-delivery storage, atomic unique claims, processing/completion/failure states, and seven-day scheduled cleanup. The remaining gate is manual staging migration application and deployed Twilio QA against the configured staging origin.
