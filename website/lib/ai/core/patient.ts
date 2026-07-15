// website/lib/ai/core/patient.ts

/**
 * ============================================================
 * PatientPilot AI
 * Patient Domain Model
 * ============================================================
 */

export interface PatientData {
  /**
   * Full patient name.
   */
  fullName?: string;

  /**
   * First name.
   */
  firstName?: string;

  /**
   * Last name.
   */
  lastName?: string;

  /**
   * Phone number.
   */
  phone?: string;

  /**
   * Email address.
   */
  email?: string;

  /**
   * Whether this is a new patient.
   */
  isNewPatient?: boolean;
}