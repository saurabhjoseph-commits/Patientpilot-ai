# H3 booking-policy preflight

`clinic_settings` is the authoritative clinic-configuration row. The review-only migration `0021_h3_clinic_booking_policy.sql` adds nullable policy values to that existing row; it does not update any existing clinic and does not add RLS policies.

The future Clinic Settings screen should place these controls beneath Business Hours, only after migration 0021 has been reviewed and applied:

- Minimum booking notice (minutes)
- Maximum future booking window (days)
- Slot interval (minutes)

H3 semantics:

- `minimum_booking_notice_minutes`: earliest candidate appointment start is the clinic-local current time plus this value.
- `maximum_booking_horizon_days`: a candidate start must fall no later than this many calendar days after the clinic-local current date.
- `slot_interval_minutes`: candidate start times advance by this increment. It is not an appointment duration.
- Appointment duration remains trusted clinical data: doctor-service override, then clinic-service default.

H3 must return no availability when a required clinic timezone, office-hours object, active service with valid duration, active doctor, doctor-service assignment, active schedule, or compatible appointment linkage is absent. Rooms and doctor-room assignments are evaluated only when the future clinic booking flow requires a room.

Use `docs/database-audit/H3_SCHEDULING_READINESS_AUDIT.sql` manually against a confirmed target to obtain non-sensitive per-clinic readiness results. The query does not expose clinic names or patient data.
