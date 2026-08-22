-- H3.1C READ-ONLY POST-RECONCILIATION CHECK. PASS requires every row PRESENT.
with required_tables(table_name) as (values ('clinics'),('clinic_settings'),('clinic_services'),('doctors'),('doctor_services'),('doctor_schedules'),('doctor_leave'),('blocked_time'),('clinic_rooms'),('doctor_room_assignments'),('appointments')),
required_columns(table_name,column_name) as (values ('clinic_settings','minimum_booking_notice_minutes'),('clinic_settings','maximum_booking_horizon_days'),('clinic_settings','slot_interval_minutes'),('appointments','clinic_id'),('appointments','doctor_id'),('appointments','service_id'),('appointments','room_id'),('appointments','duration_minutes'),('appointments','appointment_date'),('appointments','appointment_time'),('appointments','status'))
select 'table' as audit_kind, table_name as object_name, case when to_regclass('public.' || table_name) is null then 'FAIL' else 'PASS' end as result from required_tables
union all
select 'column', required.table_name || '.' || required.column_name, case when actual.column_name is null then 'FAIL' else 'PASS' end
from required_columns required left join information_schema.columns actual on actual.table_schema = 'public' and actual.table_name = required.table_name and actual.column_name = required.column_name
order by audit_kind, object_name;
