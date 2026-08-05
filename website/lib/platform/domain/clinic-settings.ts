/**
 * ============================================================
 * PatientPilot AI
 * Clinic Settings
 * ============================================================
 */

export interface ClinicSettings {
  readonly id: string;

  readonly clinicId: string;

  readonly aiName: string;

  readonly greeting: string;

  readonly officeHours: Record<string, unknown>;

  readonly services: Record<string, unknown>;

  readonly faq: Record<string, unknown>;

  readonly emergencyRules: Record<string, unknown>;

  readonly schedulingRules: Record<string, unknown>;

  readonly voice: string;

  readonly language: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}