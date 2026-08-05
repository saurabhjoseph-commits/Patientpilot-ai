-- REVIEW ONLY: synthetic staging seed. Apply only after 0000 in confirmed staging.
-- No clinic is inserted: J.2 migration 0004 must create the bootstrap clinic.
-- Execute the complete file as one transaction in the Supabase SQL Editor.

begin;

insert into public.contacts (id, clinic_name, dentist_name, email, phone, monthly_calls, message)
values
  (1001, 'Synthetic Practice One', 'Synthetic Owner One', 'synthetic-contact-1@example.test', '+15550001001', '10', 'Synthetic staging lead one'),
  (1002, 'Synthetic Practice Two', 'Synthetic Owner Two', 'synthetic-contact-2@example.test', '+15550001002', '20', 'Synthetic staging lead two'),
  (1003, 'Synthetic Practice Three', 'Synthetic Owner Three', 'synthetic-contact-3@example.test', '+15550001003', '30', 'Synthetic staging lead three');

insert into public.appointments (id, patient_name, phone, email, service, appointment_date, appointment_time, notes)
values
  ('00000000-0000-4000-8000-000000000101', 'Synthetic Appointment One', '+15550002001', 'synthetic-appointment-1@example.test', 'Cleaning', '2026-08-10', '09:00', 'Synthetic staging appointment'),
  ('00000000-0000-4000-8000-000000000102', 'Synthetic Appointment Two', '+15550002002', 'synthetic-appointment-2@example.test', 'Consultation', '2026-08-11', '10:00', 'Synthetic staging appointment'),
  ('00000000-0000-4000-8000-000000000103', 'Synthetic Appointment Three', '+15550002003', 'synthetic-appointment-3@example.test', 'Cleaning', '2026-08-12', '11:00', 'Synthetic staging appointment'),
  ('00000000-0000-4000-8000-000000000104', 'Synthetic Appointment Four', '+15550002004', 'synthetic-appointment-4@example.test', 'Emergency', '2026-08-13', '12:00', 'Synthetic staging appointment');

insert into public.calls (id, call_sid, patient_name, phone)
values
  ('00000000-0000-4000-8000-000000000201', 'STAGING-CALL-001', 'Synthetic Caller One', '+15550003001'),
  ('00000000-0000-4000-8000-000000000202', 'STAGING-CALL-002', 'Synthetic Caller Two', '+15550003002'),
  ('00000000-0000-4000-8000-000000000203', 'STAGING-CALL-003', 'Synthetic Caller Three', '+15550003003'),
  ('00000000-0000-4000-8000-000000000204', 'STAGING-CALL-004', 'Synthetic Caller Four', '+15550003004');

insert into public.call_messages (id, call_id, sender, message)
values ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000201', 'patient', 'Synthetic staging message');

insert into public.lead_activity (id, lead_id, type, description)
values
  (2001, 1001, 'Status', 'Synthetic staging activity one'),
  (2002, 1002, 'Status', 'Synthetic staging activity two'),
  (2003, 1003, 'Status', 'Synthetic staging activity three');

select setval('public.lead_activity_id_seq', 2003, true);

commit;
