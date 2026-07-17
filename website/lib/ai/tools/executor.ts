// website/lib/ai/tools/executor.ts

import { TOOL_REGISTRY } from "./registry";
import { mapWorkflowExecution } from "./mapper";

import type { AIConversationSession } from "@/lib/ai/core/session";

import type {
  AIToolName,
  ToolContext,
} from "./types";

/**
 * ============================================================
 * PatientPilot AI
 * Tool Executor
 * ============================================================
 *
 * Coordinates workflow execution.
 *
 * Responsibilities:
 * - Build tool input from the session.
 * - Resolve the correct executor.
 * - Execute the business tool.
 *
 * It does NOT:
 * - Contain business logic.
 * - Access the database directly.
 * * ============================================================
 */
export async function executeTool(
  tool: AIToolName,
  session: AIConversationSession,
  context: ToolContext,
) {
  const execution =
    mapWorkflowExecution(
      tool,
      session,
    );

  const executor =
    TOOL_REGISTRY[
      execution.tool
    ];

  if (!executor) {
    throw new Error(
      `Unknown tool: ${execution.tool}`,
    );
  }

  return executor(
    execution.input as never,
    context,
  );
}