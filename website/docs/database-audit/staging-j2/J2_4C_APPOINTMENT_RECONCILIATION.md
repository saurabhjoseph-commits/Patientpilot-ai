# J.2.4C Appointment Persistence Reconciliation

## Canonical persistence mapping

| Application meaning | Production column | Treatment |
| --- | --- | --- |
| Clinic ownership | `clinic_id` | Required trusted scope. |
| Patient name | `patient_name` | Direct mapping. |
| `phone_number` | `phone` | Compatibility rename; same meaning. |
| Email | `email` | Direct mapping. |
| Appointment reason | `service` | The AI and API use reason as the requested service. |
| Appointment date/time | `appointment_date`, `appointment_time` | Direct mapping. |
| Status/source/notes | `status`, `source`, `notes` | Direct mapping; source defaults to `AI Receptionist`. |

## Removed persistence fields

- `clinic_name`: not persisted; clinic ownership is `clinic_id`.
- `call_sid`: retained in AI workflow/session and summary context, not written to appointments.
- `lead_id`: not written; the production export supplies no appointment-to-lead relation.

## Inventory

| File | Purpose | Persistence status |
| --- | --- | --- |
| `lib/appointments/types.ts` | Canonical application DTOs | Production-aligned. |
| `lib/appointments/mapper.ts` | Pure row/payload transformation | Production columns only. |
| `lib/appointments/repository.ts` | Scoped persistence | Production columns only. |
| `lib/appointments/service.ts` | Validation and repository delegation | No direct database access. |
| `app/api/appointments/route.ts` | Staff-facing API compatibility mapping | `appointment_type`/`reason` map to `service`. |
| `lib/appointments/integration.ts` | AI booking workflow | AI reason maps to service; call ID remains external. |
| `lib/patients/integration.ts` | Patient synchronization | Receives clinic display name separately. |
| `app/admin/appointments/page.tsx` | UI | Already reads exported production columns. |

## Baseline result

The reconciled appointment payload uses only columns created by `0000_j2_staging_baseline_schema.sql`. No appointment write requires `clinic_name`, `phone_number`, `reason`, `call_sid`, or `lead_id`.
