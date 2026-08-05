/**
 * PP-002 Milestone A
 * Global Appointment Domain
 *
 * Canonical appointment record shared across
 * AI, Scheduling, CRM and PMS integrations.
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
  | "staff"
  | "patient_portal"
  | "phone"
  | "website"
  | "walk_in"
  | "pms"
  | "api";

export interface AppointmentTime {
  start: string;
  end: string;
  timezone: string;
}

export interface AppointmentService {
  serviceId?: string;
  name: string;
  duration: number; // minutes
}

export interface AppointmentReminder {
  enabled: boolean;
  sms: boolean;
  email: boolean;
  phone: boolean;
  reminderHoursBefore: number[];
}

export interface AppointmentMetadata {
  source: AppointmentSource;
  notes?: string;
  aiConversationId?: string;
  externalId?: string;
}

export interface Appointment {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId: string;

  patientId: string;

  providerId: string;

  status: AppointmentStatus;

  time: AppointmentTime;

  service: AppointmentService;

  reminder: AppointmentReminder;

  metadata: AppointmentMetadata;

  createdAt: string;

  updatedAt: string;

}