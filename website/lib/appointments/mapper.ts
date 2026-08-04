import type { Appointment, CreateAppointmentInput } from "./types";

export interface AppointmentRow {
  id: string;
  clinic_id: string;
  patient_name: string;
  phone: string | null;
  email: string | null;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  source: string;
  notes: string | null;
  created_at: string;
}

export function toAppointmentPersistence(input: CreateAppointmentInput) {
  return {
    clinic_id: input.clinicId,
    patient_name: input.patientName,
    phone: input.phone,
    email: input.email ?? null,
    service: input.service,
    appointment_date: input.appointmentDate,
    appointment_time: input.appointmentTime,
    notes: input.notes ?? null,
    source: input.source ?? "AI Receptionist",
  };
}

export function fromAppointmentPersistence(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    patientName: row.patient_name,
    phone: row.phone,
    email: row.email,
    service: row.service,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    status: row.status,
    source: row.source,
    notes: row.notes,
    createdAt: row.created_at,
  };
}
