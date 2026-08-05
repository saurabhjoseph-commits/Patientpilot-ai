/**
 * PP-003 Operations Domain
 *
 * Represents a scheduled appointment between
 * a patient and a clinic.
 *
 * This aggregate models scheduling only.
 * Clinical encounters, reminders, participants,
 * procedures and status history are modeled
 * separately.
 */

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentType =
  | "consultation"
  | "new_patient"
  | "follow_up"
  | "emergency"
  | "treatment"
  | "hygiene"
  | "virtual"
  | "custom";

export type AppointmentSource =
  | "manual"
  | "website"
  | "patient_portal"
  | "ai_agent"
  | "phone"
  | "walk_in"
  | "api";

export interface AppointmentSchedule {

  startsAt: string;

  endsAt: string;

  timezone: string;

}

export interface AppointmentParticipants {

  patientId: string;

  providerId?: string;

}

export interface AppointmentLocation {

  locationId: string;

  operatoryId?: string;

}

export interface AppointmentMetadata {

  reason?: string;

  notes?: string;

  externalId?: string;

}

export interface Appointment {

  id: string;

  tenantId: string;

  clinicId: string;

  status: AppointmentStatus;

  type: AppointmentType;

  source: AppointmentSource;

  schedule: AppointmentSchedule;

  participants: AppointmentParticipants;

  location: AppointmentLocation;

  metadata: AppointmentMetadata;

  createdAt: string;

  updatedAt: string;

}