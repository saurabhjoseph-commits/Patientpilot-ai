-- H3.1B READ-ONLY STAGING VERIFICATION. Run immediately after migration 0023.
select tgname, tgenabled, pg_get_triggerdef(oid) as trigger_definition
from pg_trigger where tgrelid = 'public.appointments'::regclass and tgname = 'appointments_prevent_overlap' and not tgisinternal;

select proname, pg_get_functiondef(oid) as function_definition
from pg_proc where oid = 'public.prevent_appointment_overlap()'::regprocedure;

select indexname, indexdef from pg_indexes
where schemaname = 'public' and tablename = 'appointments'
  and indexname in ('appointments_clinic_doctor_date_idx', 'appointments_clinic_room_date_idx')
order by indexname;

-- Compare this count snapshot with the one captured before migration. The migration is DDL-only.
select count(*) as appointment_count,
  count(*) filter (where status = 'Cancelled') as cancelled_count,
  count(*) filter (where status = 'Completed') as completed_count
from public.appointments;

-- Capture before and after migration and compare exactly. This exposes no patient data.
select id, clinic_id, doctor_id, room_id, appointment_date, appointment_time, duration_minutes, status
from public.appointments
order by id;
