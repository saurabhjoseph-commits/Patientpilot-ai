/**
 * ============================================================
 * PatientPilot AI
 * Supabase Clinic Settings Repository
 * ============================================================
 *
 * Infrastructure implementation of
 * IClinicSettingsRepository.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ClinicSettings } from "@/lib/platform/domain/clinic-settings";

import type {
  CreateClinicSettingsData,
  IClinicSettingsRepository,
  UpdateClinicSettingsData,
} from "@/lib/application/interfaces/IClinicSettingsRepository";

export class ClinicSettingsRepository
  implements IClinicSettingsRepository
{
  constructor(
    private readonly db: SupabaseClient,
  ) {}

  async findByClinicId(
    clinicId: string,
  ): Promise<ClinicSettings | null> {
    const { data, error } = await this.db
      .from("clinic_settings")
      .select("*")
      .eq("clinic_id", clinicId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as ClinicSettings | null;
  }

  async create(
    data: CreateClinicSettingsData,
  ): Promise<ClinicSettings> {
    const { data: created, error } =
      await this.db
        .from("clinic_settings")
        .insert({
          clinic_id: data.clinicId,
          ai_name: data.aiName,
          greeting: data.greeting,
          office_hours: data.officeHours,
          services: data.services,
          faq: data.faq,
          emergency_rules: data.emergencyRules,
          scheduling_rules:
            data.schedulingRules,
          voice: data.voice,
          language: data.language,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return created as ClinicSettings;
  }

  async update(
    clinicId: string,
    data: UpdateClinicSettingsData,
  ): Promise<ClinicSettings> {
    const { data: updated, error } =
      await this.db
        .from("clinic_settings")
        .update({
          ai_name: data.aiName,
          greeting: data.greeting,
          office_hours: data.officeHours,
          services: data.services,
          faq: data.faq,
          emergency_rules:
            data.emergencyRules,
          scheduling_rules:
            data.schedulingRules,
          voice: data.voice,
          language: data.language,
        })
        .eq("clinic_id", clinicId)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return updated as ClinicSettings;
  }

  async delete(
    clinicId: string,
  ): Promise<void> {
    const { error } = await this.db
      .from("clinic_settings")
      .delete()
      .eq("clinic_id", clinicId);

    if (error) {
      throw error;
    }
  }
}