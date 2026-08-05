// website/lib/ai/tools/lead.ts

import { leadService } from "@/lib/leads/service";

import type {
  CreateLeadRequest,
} from "@/lib/leads/types";

import type {
  ToolContext,
  ToolResult,
} from "./types";

/**
 * ============================================================
 * Lead Tool
 * ============================================================
 *
 * AI wrapper around the Lead Service.
 */

export async function createLeadTool(
  input: CreateLeadRequest,
  context: ToolContext,
): Promise<ToolResult> {

  const lead =
    await leadService.bookDemo(input, requireClinicScope(context));

  return {
    success: true,

    data: lead,

    message:
      "Lead created successfully.",
  };
}

function requireClinicScope(context: ToolContext) {
  if (!context.clinicScope) {
    throw new Error("AI workflow is missing a trusted clinic scope.");
  }
  return context.clinicScope;
}
