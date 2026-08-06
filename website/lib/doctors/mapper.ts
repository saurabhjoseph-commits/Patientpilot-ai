import type { Doctor } from "./types";

export interface DoctorRow {
  id: string; clinic_id: string; auth_user_id: string | null; full_name: string; email: string; phone: string | null;
  qualification: string | null; specialisation: string | null; registration_number: string | null; languages: string[] | null;
  profile_photo_url: string | null; default_appointment_duration_minutes: number; status: "active" | "inactive"; created_at: string; updated_at: string;
}

export function toDoctor(row: DoctorRow): Doctor {
  return { id: row.id, clinicId: row.clinic_id, authUserId: row.auth_user_id, fullName: row.full_name, email: row.email, phone: row.phone, qualification: row.qualification, specialisation: row.specialisation, registrationNumber: row.registration_number, languages: row.languages ?? [], profilePhotoUrl: row.profile_photo_url, defaultAppointmentDurationMinutes: row.default_appointment_duration_minutes, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at };
}
