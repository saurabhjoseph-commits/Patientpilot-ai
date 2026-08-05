/**
 * ============================================================
 * PatientPilot AI
 * Clinic Settings Repository
 * ============================================================
 *
 * Application Layer contract for clinic settings persistence.
 *
 * This interface is implemented by the Infrastructure Layer
 * (Supabase, PostgreSQL, etc.).
 */

import type { ClinicSettings } from "@/lib/platform/domain/clinic-settings";

export interface CreateClinicSettingsData {
  clinicId: string;

  aiName: string;

  greeting: string;

  officeHours: Record<string, unknown>;

  services: Record<string, unknown>;

  faq: Record<string, unknown>;

  emergencyRules: Record<string, unknown>;

  schedulingRules: Record<string, unknown>;

  voice: string;

  language: string;
}

export interface UpdateClinicSettingsData {
  aiName?: string;

  greeting?: string;

  officeHours?: Record<string, unknown>;

  services?: Record<string, unknown>;

  faq?: Record<string, unknown>;

  emergencyRules?: Record<string, unknown>;

  schedulingRules?: Record<string, unknown>;

  voice?: string;

  language?: string;
}

export interface IClinicSettingsRepository {
  /**
   * Returns settings for a clinic.
   */
  findByClinicId(
    clinicId: string,
  ): Promise<ClinicSettings | null>;

  /**
   * Creates the default clinic settings.
   */
  create(
    data: CreateClinicSettingsData,
  ): Promise<ClinicSettings>;

  /**
   * Updates clinic settings.
   */
  update(
    clinicId: string,
    data: UpdateClinicSettingsData,
  ): Promise<ClinicSettings>;

  /**
   * Deletes clinic settings.
   */
  delete(
    clinicId: string,
  ): Promise<void>;
}