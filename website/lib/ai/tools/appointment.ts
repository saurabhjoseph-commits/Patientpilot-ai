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
  input: CreateAppointmentInput,
  context: ToolContext,
): Promise<ToolResult> {

  const appointment =
    await createAppointmentService({
      ...input,
      callSid: context.callId,
    });

  return {
    success: true,
    data: appointment,
    message:
      "Appointment created successfully.",
  };
}