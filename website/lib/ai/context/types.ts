// website/lib/ai/context/types.ts

/**
 * ============================================================
 * PatientPilot AI
 * AI Context Types
 * ============================================================
 */

export interface ClinicContext {
  id: string;

  name: string;

  timezone: string;

  phoneNumber?: string;

  email?: string;

  businessHours?: string;

  enabled: boolean;
}

export interface TenantContext {
  id: string;

  slug: string;

  country: string;

  locale: string;

  currency: string;
}

export interface AISettings {
  voice: string;

  language: string;

  enableRecording: boolean;

  enableHumanHandoff: boolean;

  defaultAppointmentDuration: number;
}