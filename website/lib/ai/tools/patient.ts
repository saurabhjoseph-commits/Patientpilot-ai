// website/lib/ai/tools/patient.ts

import {
  findOrCreatePatient,
} from "@/lib/patients/service";

import type {
  CreatePatientInput,
} from "@/lib/patients/types";

import type {
  ToolContext,
  ToolResult,
} from "./types";

/**
 * ============================================================
 * Patient Tool
 * ============================================================
 *
 * AI wrapper around the Patient Service.
 */

export async function createOrUpdatePatientTool(
  input: CreatePatientInput,
  _context: ToolContext,
): Promise<ToolResult> {
  const patient =
    await findOrCreatePatient(input);

  return {
    success: true,

    data: patient,

    message:
      "Patient record synchronized successfully.",
  };
}