/**
 * ============================================================
 * PatientPilot AI
 * Patient Types
 * ============================================================
 */

export type PatientStatus =
  | "active"
  | "inactive"
  | "new";

/**
 * Patient record.
 */
export interface Patient {
  id: string;

  clinicName: string;

  firstName: string;

  lastName: string;

  fullName: string;

  phoneNumber: string;

  email?: string;

  dateOfBirth?: string;

  preferredContactMethod?:
    | "phone"
    | "sms"
    | "email";

  preferredDentist?: string;

  notes?: string;

  status: PatientStatus;

  totalAppointments: number;

  lastAppointmentDate?: string;

  lastCallDate?: string;

  createdAt: string;

  updatedAt: string;
}

/**
 * Input required when creating
 * a patient.
 */
export interface CreatePatientInput {
  clinicName: string;

  firstName: string;

  lastName: string;

  phoneNumber: string;

  email?: string;

  dateOfBirth?: string;

  preferredContactMethod?:
    | "phone"
    | "sms"
    | "email";

  preferredDentist?: string;

  notes?: string;
}

/**
 * Patient updates.
 */
export interface UpdatePatientInput {
  firstName?: string;

  lastName?: string;

  phoneNumber?: string;

  email?: string;

  dateOfBirth?: string;

  preferredContactMethod?:
    | "phone"
    | "sms"
    | "email";

  preferredDentist?: string;

  notes?: string;

  status?: PatientStatus;

  totalAppointments?: number;

  lastAppointmentDate?: string;

  lastCallDate?: string;
}

/**
 * Search filters.
 */
export interface PatientFilters {
  clinicName?: string;

  status?: PatientStatus;

  phoneNumber?: string;

  email?: string;

  name?: string;
}

/**
 * Dashboard statistics.
 */
export interface PatientStats {
  total: number;

  active: number;

  inactive: number;

  newPatients: number;
}