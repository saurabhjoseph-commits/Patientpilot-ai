/**
 * ============================================================
 * PatientPilot AI
 * Appointment Types
 * ============================================================
 */

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled";

export interface Appointment {
  id: string;

  clinicName: string;

  patientName: string;

  phoneNumber: string;

  appointmentDate: string;

  appointmentTime: string;

  reason: string;

  status: AppointmentStatus;

  callSid?: string;

  leadId?: string;

  notes?: string;

  createdAt: string;

  updatedAt: string;
}

/**
 * Data required to create a new appointment.
 */
export interface CreateAppointmentInput {
  clinicName: string;

  patientName: string;

  phoneNumber: string;

  appointmentDate: string;

  appointmentTime: string;

  reason: string;

  callSid?: string;

  leadId?: string;

  notes?: string;
}

/**
 * Data that may be updated later.
 */
export interface UpdateAppointmentInput {
  patientName?: string;

  phoneNumber?: string;

  appointmentDate?: string;

  appointmentTime?: string;

  reason?: string;

  status?: AppointmentStatus;

  notes?: string;

  leadId?: string;
}

/**
 * Appointment search filters.
 */
export interface AppointmentFilters {
  status?: AppointmentStatus;

  appointmentDate?: string;

  clinicName?: string;

  patientName?: string;

  phoneNumber?: string;
}

/**
 * Dashboard statistics.
 */
export interface AppointmentStats {
  total: number;

  pending: number;

  confirmed: number;

  completed: number;

  cancelled: number;

  rescheduled: number;
}