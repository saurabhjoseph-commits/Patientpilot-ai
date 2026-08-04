/**
 * ============================================================
 * PatientPilot AI
 * Appointment Slot Domain Types
 * ============================================================
 */

export type AppointmentSlotStatus =
  | "available"
  | "reserved"
  | "booked"
  | "blocked"
  | "unavailable";

export type AppointmentSlotSource =
  | "system"
  | "manual"
  | "provider"
  | "holiday"
  | "maintenance";

export interface AppointmentSlotProvider {
  providerId: string;

  clinicId: string;

  operatoryId?: string;
}

export interface AppointmentSlotSchedule {
  startsAt: Date;

  endsAt: Date;

  timezone: string;

  durationMinutes: number;
}

export interface AppointmentSlotReservation {
  appointmentId?: string;

  customerId?: string;

  reservedUntil?: Date;
}

export interface AppointmentSlot {
  id: string;

  tenantId: string;

  status: AppointmentSlotStatus;

  source: AppointmentSlotSource;

  provider: AppointmentSlotProvider;

  schedule: AppointmentSlotSchedule;

  reservation: AppointmentSlotReservation;

  createdAt: Date;

  updatedAt: Date;
}