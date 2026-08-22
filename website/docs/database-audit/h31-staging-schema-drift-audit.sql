-- H3.1C READ-ONLY STAGING SCHEMA DRIFT AUDIT. No DDL or DML.
with expected_tables(table_name) as (values
  ('clinics'), ('clinic_settings'), ('clinic_services'), ('doctors'), ('doctor_services'),
  ('doctor_schedules'), ('doctor_leave'), ('blocked_time'), ('clinic_rooms'),
  ('doctor_room_assignments'), ('appointments')
), expected_columns(table_name, column_name, data_type, is_nullable) as (values
  ('clinic_settings','clinic_id','uuid','NO'), ('clinic_settings','office_hours','jsonb','YES'), ('clinic_settings','minimum_booking_notice_minutes','integer','YES'), ('clinic_settings','maximum_booking_horizon_days','integer','YES'), ('clinic_settings','slot_interval_minutes','integer','YES'),
  ('clinic_services','id','uuid','NO'), ('clinic_services','clinic_id','uuid','NO'), ('clinic_services','name','text','NO'), ('clinic_services','default_duration_minutes','integer','NO'), ('clinic_services','active','boolean','NO'),
  ('doctors','id','uuid','NO'), ('doctors','clinic_id','uuid','NO'), ('doctors','full_name','text','NO'), ('doctors','email','text','NO'), ('doctors','default_appointment_duration_minutes','integer','NO'), ('doctors','status','text','NO'),
  ('doctor_services','doctor_id','uuid','NO'), ('doctor_services','service_id','uuid','NO'), ('doctor_services','clinic_id','uuid','NO'), ('doctor_services','active','boolean','NO'), ('doctor_services','custom_duration_minutes','integer','YES'),
  ('doctor_schedules','id','uuid','NO'), ('doctor_schedules','clinic_id','uuid','NO'), ('doctor_schedules','doctor_id','uuid','NO'), ('doctor_schedules','weekday','smallint','NO'), ('doctor_schedules','start_time','time without time zone','NO'), ('doctor_schedules','end_time','time without time zone','NO'), ('doctor_schedules','effective_from','date','YES'), ('doctor_schedules','effective_to','date','YES'), ('doctor_schedules','timezone','text','NO'), ('doctor_schedules','active','boolean','NO'),
  ('doctor_leave','id','uuid','NO'), ('doctor_leave','clinic_id','uuid','NO'), ('doctor_leave','doctor_id','uuid','NO'), ('doctor_leave','starts_on','date','NO'), ('doctor_leave','ends_on','date','NO'), ('doctor_leave','active','boolean','NO'),
  ('blocked_time','id','uuid','NO'), ('blocked_time','clinic_id','uuid','NO'), ('blocked_time','doctor_id','uuid','YES'), ('blocked_time','room_id','uuid','YES'), ('blocked_time','starts_at','timestamp with time zone','NO'), ('blocked_time','ends_at','timestamp with time zone','NO'), ('blocked_time','active','boolean','NO'),
  ('clinic_rooms','id','uuid','NO'), ('clinic_rooms','clinic_id','uuid','NO'), ('clinic_rooms','name','text','NO'), ('clinic_rooms','active','boolean','NO'),
  ('doctor_room_assignments','id','uuid','NO'), ('doctor_room_assignments','clinic_id','uuid','NO'), ('doctor_room_assignments','doctor_id','uuid','NO'), ('doctor_room_assignments','room_id','uuid','NO'), ('doctor_room_assignments','effective_from','date','YES'), ('doctor_room_assignments','effective_to','date','YES'), ('doctor_room_assignments','active','boolean','NO'),
  ('appointments','id','uuid','NO'), ('appointments','clinic_id','uuid','NO'), ('appointments','doctor_id','uuid','YES'), ('appointments','service_id','uuid','YES'), ('appointments','room_id','uuid','YES'), ('appointments','duration_minutes','integer','YES'), ('appointments','appointment_date','text','NO'), ('appointments','appointment_time','text','NO'), ('appointments','status','text','NO')
), expected_indexes(index_name) as (values
  ('clinic_services_clinic_active_idx'), ('doctors_clinic_status_idx'), ('doctor_services_clinic_active_idx'), ('doctor_schedules_clinic_doctor_idx'), ('doctor_leave_clinic_doctor_dates_idx'), ('blocked_time_clinic_dates_idx'), ('clinic_rooms_clinic_name_key'), ('doctor_room_assignments_clinic_doctor_idx'), ('appointments_clinic_doctor_date_idx'), ('appointments_clinic_room_date_idx')
), expected_constraints(constraint_name) as (values
  ('clinic_services_id_clinic_id_key'), ('doctors_id_clinic_id_key'), ('doctor_services_pkey'), ('clinic_rooms_id_clinic_id_key'), ('appointments_doctor_clinic_fkey'), ('appointments_service_clinic_fkey'), ('appointments_room_clinic_fkey'), ('appointments_duration_minutes_positive'), ('clinic_settings_minimum_booking_notice_minutes_range'), ('clinic_settings_maximum_booking_horizon_days_range'), ('clinic_settings_slot_interval_minutes_range')
)
select 'table' as audit_kind, expected.table_name as object_name, case when actual.table_name is null then 'MISSING' else 'PRESENT' end as result, null::text as detail
from expected_tables expected left join information_schema.tables actual on actual.table_schema = 'public' and actual.table_name = expected.table_name
union all
select 'column', expected.table_name || '.' || expected.column_name, case when actual.column_name is null then 'MISSING' when actual.data_type <> expected.data_type or actual.is_nullable <> expected.is_nullable then 'MISMATCH' else 'PRESENT' end, case when actual.column_name is null then null else 'actual=' || actual.data_type || ', nullable=' || actual.is_nullable end
from expected_columns expected left join information_schema.columns actual on actual.table_schema = 'public' and actual.table_name = expected.table_name and actual.column_name = expected.column_name
union all
select 'index', expected.index_name, case when actual.indexname is null then 'MISSING' else 'PRESENT' end, null::text
from expected_indexes expected left join pg_indexes actual on actual.schemaname = 'public' and actual.indexname = expected.index_name
union all
select 'constraint', expected.constraint_name, case when actual.conname is null then 'MISSING' else 'PRESENT' end, null::text
from expected_constraints expected left join pg_constraint actual on actual.connamespace = 'public'::regnamespace and actual.conname = expected.constraint_name
order by audit_kind, object_name;

-- Expected RLS: enabled on every G2/G3/G4 table; no browser policy is introduced by these migrations.
select relname as table_name, relrowsecurity as rls_enabled
from pg_class where relnamespace = 'public'::regnamespace
  and relname in ('clinic_services','doctors','doctor_services','doctor_schedules','doctor_leave','blocked_time','clinic_rooms','doctor_room_assignments')
order by relname;
