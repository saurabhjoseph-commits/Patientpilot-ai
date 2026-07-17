import { createAppointmentTool } from "./appointment";
import { createLeadTool } from "./lead";
import { createOrUpdatePatientTool } from "./patient";

import type {
  AIToolName,
  ToolContext,
  ToolResult,
} from "./types";

type ToolExecutor = (
  input: unknown,
  context: ToolContext,
) => Promise<ToolResult>;

export const TOOL_REGISTRY: Record<
  AIToolName,
  ToolExecutor
> = {
  "appointment.create":
    createAppointmentTool as ToolExecutor,

  "patient.createOrUpdate":
    createOrUpdatePatientTool as ToolExecutor,

  "lead.create":
    createLeadTool as ToolExecutor,
};