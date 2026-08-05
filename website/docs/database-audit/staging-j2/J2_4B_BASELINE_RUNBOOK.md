# J.2.4B Staging Baseline Reconstruction

## Execution order

1. Confirm the target is project `tgpcgyuujaklgepknucd`, not production.
2. Capture a staging backup/restore point and retain the current empty-schema evidence.
3. Review and apply `0000_j2_staging_baseline_schema.sql` manually in staging.
4. Verify the created tables, constraints, indexes, RLS state, and policies against the CSV exports.
5. Review and apply `0001_j2_staging_baseline_seed.sql` manually in staging.
6. Verify the expected counts: clinics `0`, contacts `3` unowned, appointments `4` unowned, calls `4` unowned, call messages `1` unowned, clinic settings `0`, and lead activity `3`.
7. Only after baseline verification, proceed to the separate J.2 migration execution checklist; do not run `0003`-`0007` as part of this package.

## Rollback

This package is intended for an empty staging database. The preferred rollback is restoring the captured staging restore point. Do not use it against a populated environment. Dropping individual tables is not an equivalent rollback because it does not restore policy, sequence, or pre-existing state.

## Export limits

The J.2.4D exports complete the patient and profile table definitions, so the baseline now includes both tables, their exported constraints/indexes/RLS, patient policies, `call_summaries_patient_id_fkey`, and the exact exported `call_summaries_outcome_check` expression. Trigger definitions remain unavailable and are intentionally not inferred.

## Application compatibility blocker

The appointment repository and API contract were reconciled in J.2.4C. They now write only the exported appointment columns, so appointment persistence is compatible with this baseline.
