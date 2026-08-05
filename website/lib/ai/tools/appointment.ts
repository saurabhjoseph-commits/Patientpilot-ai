// website/lib/ai/tools/appointment.ts

import {
  createAppointmentService,
} from "@/lib/appointments/service";

import type {
  CreateAppointmentInput,
} from "@/lib/appointments/types";

import type {
  ToolContext,
  ToolResult,
} from "./types";

export async function createAppointmentTool(
  input: Omit<CreateAppointmentInput, "clinicId">,
  context: ToolContext,
): Promise<ToolResult> {

  if (!context.clinicScope) {
    throw new Error("AI workflow is missing a trusted clinic scope.");
  }

  const appointment =
    await createAppointmentService({
      ...input,
      clinicId: context.clinicScope.clinicId,
    });

  return {
    success: true,
    data: appointment,
    message:
      "Appointment created successfully.",
  };
}
