# J.2.4A Connection and Ownership Evidence

**Date:** 2026-08-03  
**Mode:** Read-only staging candidate audit. No migration was executed.

## Target and credential checks

- The configured Supabase endpoint is a valid HTTPS URL ending in `.supabase.co`.
- Project identifier: `tkhkjeoqslirriqinxxb`.
- A service-role credential was present and a read-only `clinics` query succeeded.
- Credential values were not read into evidence or printed.

The project identifier does not itself contain a staging label. No known production project identifier was available for a distinct-target comparison, so this evidence does not prove the target is staging.

## Read-only schema availability and row counts

| Table | Total rows | Unowned rows |
| --- | ---: | ---: |
| clinics | 0 | n/a |
| contacts | 3 | 3 |
| appointments | 4 | 4 |
| calls | 4 | 4 |
| call_messages | 1 | 1 |
| clinic_settings | 0 | n/a |
| lead_activity | 3 | n/a |

The expected table and ownership columns were available through read-only API queries. These counts match the reviewed J.2 preflight expectations.

## Evidence limitations

`pg_policies`, foreign-key definitions, indexes, full column metadata, and backup/restore-point state require database-administration evidence or a separately approved read-only SQL export. They were not inferred from REST access. Synthetic data was already present; no data was created or changed.

## Migration status

Migrations `0003` through `0007` were not run.
