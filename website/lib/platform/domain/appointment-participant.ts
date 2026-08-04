/**
 * PP-003 Operations Domain
 *
 * Represents a participant involved in an appointment.
 *
 * Multiple participants may belong to a single
 * appointment.
 */

export type AppointmentParticipantEntityType =
  | "patient"
  | "provider"
  | "staff"
  | "guardian"
  | "interpreter"
  | "observer"
  | "ai_agent"
  | "external";

export type AppointmentParticipantRole =
  | "patient"
  | "primary_provider"
  | "assistant"
  | "hygienist"
  | "specialist"
  | "guardian"
  | "interpreter"
  | "observer"
  | "coordinator"
  | "ai_assistant"
  | "other";

export type AppointmentParticipantStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "present"
  | "completed"
  | "cancelled"
  | "no_show";

export interface AppointmentParticipantEntity {

  type: AppointmentParticipantEntityType;

  id: string;

}

export interface AppointmentParticipantAttendance {

  checkedInAt?: string;

  checkedOutAt?: string;

}

export interface AppointmentParticipantMetadata {

  notes?: string;

  externalId?: string;

}

export interface AppointmentParticipant {

  id: string;

  tenantId: string;

  clinicId: string;

  appointmentId: string;

  entity: AppointmentParticipantEntity;

  role: AppointmentParticipantRole;

  status: AppointmentParticipantStatus;

  attendance: AppointmentParticipantAttendance;

  metadata: AppointmentParticipantMetadata;

  createdAt: string;

  updatedAt: string;

}