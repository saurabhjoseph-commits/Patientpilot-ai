import { ValidationError } from "@/lib/core/api/errors";
import { logLeadActivity } from "@/lib/activity";

import { validateLead } from "./validation";

import {
  createLead,
  updateLeadStatus,
  deleteLead,
} from "./supabase-repository";

import type {
  CreateLeadRequest,
  Lead,
} from "./types";
import type { ClinicScope } from "@/lib/clinic/clinic-scope";

export const leadService = {
  /**
   * Creates a new demo lead.
   */
  async bookDemo(
    request: CreateLeadRequest,
    scope: ClinicScope,
  ): Promise<Lead> {
    validateLead(request);

    return createLead(request, scope);
  },

  /**
   * Updates lead status.
   */
  async updateStatus(
    id: number,
    status: string,
    scope: ClinicScope,
  ): Promise<Lead> {
    if (!status) {
      throw new ValidationError(
        "Status is required."
      );
    }

    const lead = await updateLeadStatus(
      id,
      status,
      scope,
    );

    await logLeadActivity({
      leadId: id,
      type: "Status",
      description: `Status changed to "${status}"`,
    });

    return lead;
  },

  /**
   * Deletes a lead.
   */
  async delete(
    id: number,
    scope: ClinicScope,
  ): Promise<void> {
    await deleteLead(id, scope);
  },
};
