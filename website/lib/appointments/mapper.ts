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
  doctor_id: string | null;
  service_id: string | null;
  room_id: string | null;
  duration_minutes: number | null;
  checked_in_at: string | null;
  completed_at: string | null;
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
    status: input.status ?? "Confirmed",
    doctor_id: input.doctorId ?? null,
    service_id: input.serviceId ?? null,
    room_id: input.roomId ?? null,
    duration_minutes: input.durationMinutes ?? null,
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
    doctorId: row.doctor_id,
    serviceId: row.service_id,
    roomId: row.room_id,
    durationMinutes: row.duration_minutes,
    checkedInAt: row.checked_in_at,
    completedAt: row.completed_at,
  };
}
