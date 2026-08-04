# J.2.4D Patient and Profile Schema Completion

## Patients

The baseline now recreates all exported patient columns, defaults, primary key, exported checks, secondary indexes, RLS, and both exported policies. The patient repository maps exactly those columns through a typed pure mapper.

## Profiles

The baseline recreates the exported profile columns, primary key, role check, clinic ownership foreign key, and `auth.users` foreign key. RLS is enabled. No profile policy was created because none appears in the authoritative policy export, and no current application repository writes profiles.

## Restored summary relationship

`call_summaries.patient_id` now references `patients.id` with `ON UPDATE NO ACTION ON DELETE SET NULL`, as exported.

## Constraint completion

The authoritative outcome-check export supplies the exact `call_summaries_outcome_check` expression. The review-only baseline now restores it without inference.
