-- READ-ONLY H3 scheduling readiness audit.
-- Run manually against the confirmed target after G2/G3/G4/H2.1 are present.
-- It reports clinic identity and configuration counts only: no patient names,
-- phone numbers, email addresses, or appointment details are selected.

do $$
begin
  if to_regclass('public.clinics') is null
    or to_regclass('public.clinic_settings') is null
    or to_regclass('public.clinic_services') is null
    or to_regclass('public.doctors') is null
    or to_regclass('public.doctor_services') is null
    or to_regclass('public.doctor_schedules') is null
    or to_regclass('public.doctor_leave') is null
    or to_regclass('public.blocked_time') is null
    or to_regclass('public.clinic_rooms') is null
    or to_regclass('public.doctor_room_assignments') is null
    or to_regclass('public.appointments') is null then
    raise exception 'H3 readiness audit blocked: required H2.1 tables are missing';
  end if;

  if (
    select count(*) from information_schema.columns
    where table_schema = 'public'
      and table_name = 'clinic_settings'
      and column_name in ('minimum_booking_notice_minutes', 'maximum_booking_horizon_days', 'slot_interval_minutes')
  ) <> 3 then
    raise exception 'H3 readiness audit blocked: required booking-policy columns are missing';
  end if;
end
$$;

with readiness as (
  select
    c.id as clinic_id,
    c.name as clinic_name,
    (c.timezone is not null and btrim(c.timezone) <> '') as timezone_present,
    exists (
      select 1 from public.clinic_settings cs
      where cs.clinic_id = c.id and cs.office_hours is not null and jsonb_typeof(cs.office_hours) = 'object'
    ) as office_hours_present,
    exists (
      select 1 from public.clinic_settings cs
      where cs.clinic_id = c.id
        and cs.minimum_booking_notice_minutes between 0 and 10080
        and cs.maximum_booking_horizon_days between 1 and 730
        and cs.slot_interval_minutes between 5 and 240
        and mod(cs.slot_interval_minutes, 5) = 0
    ) as booking_policy_present,
    (select count(*) from public.clinic_services s where s.clinic_id = c.id and s.active) as active_services_count,
    (select count(*) from public.clinic_services s where s.clinic_id = c.id and s.active and s.default_duration_minutes > 0) as valid_service_duration_count,
    (select count(*) from public.doctors d where d.clinic_id = c.id and d.status = 'active') as active_doctors_count,
    (select count(*) from public.doctor_services ds where ds.clinic_id = c.id and ds.active) as doctor_service_assignment_count,
    (select count(*) from public.doctor_schedules ds where ds.clinic_id = c.id) as doctor_schedules_count,
    (select count(*) from public.doctor_schedules ds where ds.clinic_id = c.id and ds.active and ds.start_time < ds.end_time) as usable_schedule_count,
    (select count(*) from public.clinic_rooms r where r.clinic_id = c.id and r.active) as active_rooms_count,
    (select count(*) from public.doctor_room_assignments dra where dra.clinic_id = c.id and dra.active and (dra.effective_to is null or dra.effective_to >= current_date)) as active_doctor_room_assignment_count,
    not exists (
      select 1 from public.appointments a
      where a.clinic_id = c.id
        and ((a.doctor_id is not null or a.service_id is not null or a.room_id is not null)
          and (a.service_id is null or a.duration_minutes is null or a.duration_minutes <= 0))
    ) as appointment_linkage_compatible,
    exists (
      select 1
      from public.doctor_services ds
      join public.doctors d on d.id = ds.doctor_id and d.clinic_id = ds.clinic_id
      join public.clinic_services s on s.id = ds.service_id and s.clinic_id = ds.clinic_id
      where ds.clinic_id = c.id and ds.active and d.status = 'active' and s.active
        and (ds.custom_duration_minutes is null or ds.custom_duration_minutes > 0)
    ) as valid_doctor_service_assignment_present
  from public.clinics c
)
select
  clinic_id,
  clinic_name,
  timezone_present,
  office_hours_present,
  booking_policy_present,
  active_services_count,
  valid_service_duration_count,
  active_doctors_count,
  doctor_service_assignment_count,
  doctor_schedules_count,
  usable_schedule_count,
  active_rooms_count,
  active_doctor_room_assignment_count,
  appointment_linkage_compatible,
  (
    timezone_present
    and office_hours_present
    and booking_policy_present
    and valid_service_duration_count > 0
    and active_doctors_count > 0
    and valid_doctor_service_assignment_present
    and usable_schedule_count > 0
    and active_rooms_count > 0
    and active_doctor_room_assignment_count > 0
    and appointment_linkage_compatible
  ) as h3_ready
from readiness
order by clinic_name, clinic_id;
