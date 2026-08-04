# J.2.4A Staging Environment Bootstrap Audit

**Date:** 2026-08-03  
**Scope:** Read-only local configuration audit. No database connection or migration was executed.

## Target verification

The configured `NEXT_PUBLIC_SUPABASE_URL` was present but did not parse as a valid HTTPS URL. Consequently, its hostname could not be verified as ending in `.supabase.co`, identified as staging, or compared against a known production project. The target is therefore not proven to be staging.

Staging credentials were present by variable name, but their values were not read or recorded. `PUBLIC_INTAKE_CLINIC_ID` is intentionally unset before bootstrap migration `0004`. `TELEPHONY_CLINIC_PHONE_MAP` is not configured.

## Telephony mapping format

`TELEPHONY_CLINIC_PHONE_MAP` must be a JSON object. Each key is a trusted destination telephone number; formatting characters are removed before lookup, while `+` is retained. Each value must be a UUID clinic identifier.

```json
{
  "+15551234567": "00000000-0000-4000-8000-000000000000"
}
```

Missing, malformed, or unmapped destination values fail closed; no clinic is selected by fallback.

## Schema, data, and evidence status

Schema comparison, ownership counts, `pg_policies` capture, staging project identifier, restore-point evidence, and synthetic data preparation were not attempted. Performing them requires a target proven to be non-production.

## Required unblock evidence

1. Valid HTTPS staging project URL ending in `.supabase.co` and demonstrably distinct from production.
2. Confirmation that production-like schema/data and a staging restore point exist.
3. Read-only staging exports for policies, ownership counts, and project identifier.
4. After target verification, either existing expected preflight data or approval to create only synthetic staging data.
