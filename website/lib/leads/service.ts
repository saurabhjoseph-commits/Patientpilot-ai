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

export const leadService = {
  /**
   * Creates a new demo lead.
   */
  async bookDemo(
    request: CreateLeadRequest
  ): Promise<Lead> {
    validateLead(request);

    return createLead(request);
  },

  /**
   * Updates lead status.
   */
  async updateStatus(
    id: number,
    status: string
  ): Promise<Lead> {
    if (!status) {
      throw new ValidationError(
        "Status is required."
      );
    }

    const lead = await updateLeadStatus(
      id,
      status
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
    id: number
  ): Promise<void> {
    await deleteLead(id);
  },
};