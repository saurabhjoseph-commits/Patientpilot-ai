import type {
  CreatePatientInput,
  Patient,
  PatientStatus,
  UpdatePatientInput,
} from "./types";

export interface PatientRow {
  id: string;
  clinic_name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  date_of_birth: string | null;
  preferred_contact_method: "phone" | "sms" | "email" | null;
  preferred_dentist: string | null;
  notes: string | null;
  status: PatientStatus;
  total_appointments: number;
  last_appointment_date: string | null;
  last_call_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientCreatePersistence {
  clinic_name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  email: string | undefined;
  date_of_birth: string | undefined;
  preferred_contact_method: "phone" | "sms" | "email" | undefined;
  preferred_dentist: string | undefined;
  notes: string | undefined;
  status: "new";
  total_appointments: 0;
}

export interface PatientUpdatePersistence {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone_number?: string;
  email?: string;
  date_of_birth?: string;
  preferred_contact_method?: "phone" | "sms" | "email";
  preferred_dentist?: string;
  notes?: string;
  status?: PatientStatus;
  total_appointments?: number;
  last_appointment_date?: string;
  last_call_date?: string;
}

export function toPatientCreatePersistence(
  input: CreatePatientInput,
): PatientCreatePersistence {
  return {
    clinic_name: input.clinicName,
    first_name: input.firstName,
    last_name: input.lastName,
    full_name: `${input.firstName} ${input.lastName}`,
    phone_number: input.phoneNumber,
    email: input.email,
    date_of_birth: input.dateOfBirth,
    preferred_contact_method: input.preferredContactMethod,
    preferred_dentist: input.preferredDentist,
    notes: input.notes,
    status: "new",
    total_appointments: 0,
  };
}

export function toPatientUpdatePersistence(
  input: UpdatePatientInput,
): PatientUpdatePersistence {
  const updates: PatientUpdatePersistence = {};

  if (input.firstName !== undefined) updates.first_name = input.firstName;
  if (input.lastName !== undefined) updates.last_name = input.lastName;

  if (input.firstName !== undefined || input.lastName !== undefined) {
    updates.full_name = [input.firstName, input.lastName]
      .filter(Boolean)
      .join(" ");
  }

  if (input.phoneNumber !== undefined) updates.phone_number = input.phoneNumber;
  if (input.email !== undefined) updates.email = input.email;
  if (input.dateOfBirth !== undefined) updates.date_of_birth = input.dateOfBirth;
  if (input.preferredContactMethod !== undefined) {
    updates.preferred_contact_method = input.preferredContactMethod;
  }
  if (input.preferredDentist !== undefined) {
    updates.preferred_dentist = input.preferredDentist;
  }
  if (input.notes !== undefined) updates.notes = input.notes;
  if (input.status !== undefined) updates.status = input.status;
  if (input.totalAppointments !== undefined) {
    updates.total_appointments = input.totalAppointments;
  }
  if (input.lastAppointmentDate !== undefined) {
    updates.last_appointment_date = input.lastAppointmentDate;
  }
  if (input.lastCallDate !== undefined) updates.last_call_date = input.lastCallDate;

  return updates;
}

export function fromPatientPersistence(row: PatientRow): Patient {
  return {
    id: row.id,
    clinicName: row.clinic_name,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    email: row.email ?? undefined,
    dateOfBirth: row.date_of_birth ?? undefined,
    preferredContactMethod: row.preferred_contact_method ?? undefined,
    preferredDentist: row.preferred_dentist ?? undefined,
    notes: row.notes ?? undefined,
    status: row.status,
    totalAppointments: row.total_appointments,
    lastAppointmentDate: row.last_appointment_date ?? undefined,
    lastCallDate: row.last_call_date ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
