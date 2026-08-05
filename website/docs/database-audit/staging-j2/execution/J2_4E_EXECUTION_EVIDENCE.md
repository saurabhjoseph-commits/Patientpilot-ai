# J.2.4E Staging Execution Evidence

**Date:** 2026-08-03  
**Target:** PatientPilot AI Staging (`tgpcgyuujaklgepknucd`)  
**Production excluded:** `tkhkjeoqslirriqinxxb`  
**Operator:** Manual Supabase SQL Editor execution

## Executed sequence

| File | Result |
| --- | --- |
| `0000_j2_staging_baseline_schema.sql` | Success; all 11 expected tables, all 30 constraints, 13 explicit indexes, 11 exported policies, and RLS on all 11 tables verified. |
| `0001_j2_staging_baseline_seed.sql` | Success; `lead_activity_id_seq` set to `2003`. |
| `0003_j2_ownership_preflight.sql` | Success; no rows returned. |
| `0004_j2_bootstrap_clinic_backfill.sql` | Success; no rows returned. |
| `0005_j2_clinic_ownership_constraints.sql` | Success; five `clinic_id` columns verified `NOT NULL`. |
| `0006_j2_rls_policy_repair.sql` | Success; zero affected policies remained. |
| `0007_j2_post_migration_validation.sql` | Success; no rows returned. |

No SQL was executed by the application agent. No production connection was used.

## Backfill evidence

- Bootstrap clinic: `6b838fad-a192-48b2-88c6-d64fbed24fcd`
- Name/slug: `PatientPilot Demo Clinic` / `patientpilot-demo`
- Country/timezone: `India` / `Asia/Kolkata`
- Contacts: 3 total, 0 null `clinic_id`, 1 distinct clinic
- Appointments: 4 total, 0 null `clinic_id`, 1 distinct clinic
- Calls: 4 total, 0 null `clinic_id`, 1 distinct clinic
- Call messages: 1 total, 0 null `clinic_id`, 1 distinct clinic
- Clinic settings: 0 total, 0 null `clinic_id`
- Lead activity: 3 total
- Orphan call messages: 0
- Orphan lead activity: 0

## RLS and application checks

- The 11 exported broad/authenticated policies were removed from the repaired tables.
- Public book-demo: pass
- Admin login: pass
- Leads page: pass
- Appointments page: pass
- Call-center page: pass

## Non-sensitive evidence retained

This file records identifiers, counts, policy outcomes, and manual SQL Editor results only. It contains no credentials or database connection strings.
