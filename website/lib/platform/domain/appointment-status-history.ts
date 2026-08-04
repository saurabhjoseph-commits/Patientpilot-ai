/**
 * PP-003 Operations Domain
 *
 * Immutable audit history for appointment
 * status transitions.
 *
 * Appointment stores only the current status.
 * Every status change is recorded here.
 */

import type { AppointmentStatus } from "./appointment";

export type AppointmentStatusChangedBy =
  | "user"
  | "provider"
  | "patient"
  | "ai_agent"
  | "system"
  | "api";

export interface AppointmentStatusActor {

  type: AppointmentStatusChangedBy;

  id?: string;

}

export interface AppointmentStatusTransition {

  previousStatus?: AppointmentStatus;

  currentStatus: AppointmentStatus;

}

export interface AppointmentStatusMetadata {

  reason?: string;

  notes?: string;

  externalId?: string;

}

export interface AppointmentStatusHistory {

  id: string;

  tenantId: string;

  clinicId: string;

  appointmentId: string;

  transition: AppointmentStatusTransition;

  changedBy: AppointmentStatusActor;

  metadata: AppointmentStatusMetadata;

  createdAt: string;

}