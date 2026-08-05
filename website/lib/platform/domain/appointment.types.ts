/**
 * ============================================================
 * PatientPilot AI
 * Appointment Domain Types
 * ============================================================
 */

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show"
  | "rescheduled";

export type AppointmentSource =
  | "ai"
  | "phone"
  | "website"
  | "walk_in"
  | "staff"
  | "import"
  | "api";

export type AppointmentPriority =
  | "routine"
  | "urgent"
  | "emergency";

export interface AppointmentPatient {
  customerId: string;

  leadId?: string;

  firstName: string;

  lastName: string;

  phone?: string;

  email?: string;
}

export interface AppointmentProvider {
  providerId: string;

  providerName: string;

  providerType:
    | "dentist"
    | "hygienist"
    | "specialist"
    | "assistant";
}

export interface AppointmentLocation {
  clinicId: string;

  operatoryId?: string;

  roomName?: string;
}

export interface AppointmentSchedule {
  startTime: Date;

  endTime: Date;

  timezone: string;

  durationMinutes: number;
}

export interface AppointmentReminder {
  enabled: boolean;

  confirmationSent: boolean;

  reminderSent: boolean;

  lastReminderAt?: Date;
}

export interface Appointment {
  id: string;

  tenantId: string;

  status: AppointmentStatus;

  priority: AppointmentPriority;

  source: AppointmentSource;

  patient: AppointmentPatient;

  provider: AppointmentProvider;

  location: AppointmentLocation;

  schedule: AppointmentSchedule;

  reminder: AppointmentReminder;

  reason: string;

  notes?: string;

  tags: string[];

  createdBy?: string;

  createdAt: Date;

  updatedAt: Date;
}