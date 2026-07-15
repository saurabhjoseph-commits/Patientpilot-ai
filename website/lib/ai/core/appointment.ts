// website/lib/ai/core/appointment.ts

/**
 * ============================================================
 * Appointment Domain Model
 * ============================================================
 */

export interface AppointmentData {
  patientName?: string;

  phoneNumber?: string;

  email?: string;

  procedure?: string;

  reason?: string;

  dentist?: string;

  insurance?: string;

  preferredDate?: string;

  preferredTime?: string;

  /**
   * Legacy aliases used during migration.
   */
  appointmentDate?: string;

  appointmentTime?: string;

  /**
 * Whether the patient has confirmed the appointment.
 *
 * Undefined means confirmation has not yet been reached.
 */
confirmed?: boolean;
}

/**
 * Compatibility alias.
 */
export type AppointmentRequest = AppointmentData;