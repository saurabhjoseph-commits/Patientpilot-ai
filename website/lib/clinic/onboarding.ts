import { ClinicService } from "./service";
import type { CreateClinicRequest, Clinic } from "./types";

import type { ClinicAddress } from "@/lib/clinic/models/address";
import type { ClinicContact } from "@/lib/clinic/models/contact";
import type { ClinicBusinessHours } from "@/components/admin/clinic/ClinicBusinessHoursForm";
import type { ClinicAISettings } from "@/components/admin/clinic/ClinicAISettingsForm";

export interface ClinicOnboardingRequest {
  clinic: CreateClinicRequest;

  address: ClinicAddress;

  contact: ClinicContact;

  businessHours: ClinicBusinessHours;

  aiSettings: ClinicAISettings;
}

export interface ClinicOnboardingResult {
  clinic: Clinic;
}

export class ClinicOnboardingService {
  constructor(
    private readonly clinicService: ClinicService,
  ) {}

  async onboard(
    request: ClinicOnboardingRequest,
  ): Promise<ClinicOnboardingResult> {
    /**
     * Phase 1
     * Create clinic.
     */
    const clinic =
      await this.clinicService.create(request.clinic);

    /**
     * Phase 2 (future)
     *
     * Save address.
     */

    /**
     * Phase 3 (future)
     *
     * Save contacts.
     */

    /**
     * Phase 4 (future)
     *
     * Save business hours.
     */

    /**
     * Phase 5 (future)
     *
     * Save AI settings.
     */

    return {
      clinic,
    };
  }
}