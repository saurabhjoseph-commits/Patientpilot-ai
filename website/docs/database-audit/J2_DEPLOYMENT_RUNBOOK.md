# J.2 Bootstrap Ownership and RLS Repair

## Staging-only execution plan

Do not run this package in production as part of this plan. Restore a production-like schema and the audited ownership data into staging, then deploy the clinic-aware application build before beginning. Run `0003`, retain the output, then run `0004` in staging. Capture the UUID emitted by the bootstrap clinic insert and configure `PUBLIC_INTAKE_CLINIC_ID` with that UUID. Configure `TELEPHONY_CLINIC_PHONE_MAP` with each trusted destination number and its staging clinic UUID; restart or redeploy the application.

Validate public intake, authenticated admin leads and details, notes, quick actions, appointment creation and reads, call creation, transcript creation, a cross-clinic call lookup returning 404, AI appointment creation, missing intake configuration, invalid telephony mapping, and production-mode test-console rejection. Only then run `0005`, repeat the workflow checks, run `0006`, repeat authorization and service-role checks, and finally run `0007`. Retain the preflight output, policy export, bootstrap UUID, deployment revision, and validation results with the release record.

## RLS compatibility

The affected application operations use the server-only service-role client. The public demo form calls a server route; it does not use a browser Supabase client. Admin and operational routes are authenticated by Identity middleware and use the server client. No browser-side Supabase query for contacts, appointments, calls, call messages, clinic settings, patients, call summaries, or AI actions was found. Removing the broad policies therefore does not remove an expected direct browser data path. Service-role credentials must remain server-only.

## Telephony security follow-up

Before production telephony enablement, validate Twilio's `X-Twilio-Signature` against the externally visible request URL and form parameters using the configured auth token. The validator must run before clinic resolution or workflow execution. If Telnyx is enabled, validate its signed payload using the provider's current public-key verification flow, preserve the raw request body, enforce the provider timestamp window, and reject replayed event identifiers. Staging tests must cover valid and invalid signatures, stale timestamps, duplicate event identifiers, reverse-proxy URL reconstruction, and local provider fixtures. Do not rely on an endpoint name or source IP.

## Patient isolation deferral

The authoritative schema does not provide verified UUID clinic ownership for `patients`. Patient isolation is a separate migration milestone; this package does not add or infer patient ownership, and patient reads must not be treated as clinic-isolated.

## Deployment order

1. Export and retain the current `pg_policies` rows for every table touched by `0006`; the checked-in CSV is an audit reference, not a rollback artifact.
2. Run `0003_j2_ownership_preflight.sql` manually and retain its output.
3. Review the bootstrap clinic values in `0004_j2_bootstrap_clinic_backfill.sql`.
4. Apply `0004`, then confirm its row-count notice reports contacts `3`, appointments `4`, calls `4`, and exactly one call message assigned from its parent call or explicitly reported as fallback.
5. Apply `0005_j2_clinic_ownership_constraints.sql`.
6. Apply `0006_j2_rls_policy_repair.sql` during a server-side maintenance window.
7. Run `0007_j2_post_migration_validation.sql` manually.

## Rollback

Do not delete the bootstrap clinic while child records reference it. Policy rollback is only possible when the pre-deployment `pg_policies` export has been retained; neither this runbook nor these migrations reconstruct policies. Ownership backfill and NOT NULL constraints are intentionally not automatically reversible because moving data back to `NULL` would weaken isolation. Do not claim that ownership can be restored without a separately captured row-level backup.

## Service-role model

Supabase `service_role` bypasses RLS and must remain server-only. Public demo/contact submission and all protected writes are server-side operations until verified JWT clinic claims and column grants support a direct client policy.

## Remaining tenant work

This migration introduces clinic ownership only. A future, separately reviewed migration must introduce `tenants`, `clinics.tenant_id`, membership, backfill, claims, and tenant-aware RLS.
