// website/lib/ai/workflow/execution.ts

import { executeTool } from "@/lib/ai/tools";
import { getSession } from "@/lib/ai/session";

import type { WorkflowPlan } from "@/lib/ai/decision/planner";
import type { ToolContext, ToolResult } from "@/lib/ai/tools";
import type { AIConversationSession } from "@/lib/ai/core";

/**
 * ============================================================
 * PatientPilot AI
 * Workflow Execution
 * ============================================================
 *
 * Executes workflow plans produced by the planner.
 *
 * Responsibilities
 * ----------------
 * • Execute business tools
 * • Refresh session
 * • Return execution result
 *
 * Does NOT
 * --------
 * • Call OpenAI
 * • Make workflow decisions
 * • Extract entities
 * • Persist messages
 * ============================================================
 */

export interface ExecutionRequest {
  callId: string;

  session: AIConversationSession;

  workflow: WorkflowPlan;
}

export interface ExecutionResult {
  session: AIConversationSession;

  toolResult?: ToolResult;

  executed: boolean;
}

export async function executeWorkflow(
  request: ExecutionRequest,
): Promise<ExecutionResult> {

  const {
    callId,
    session,
    workflow,
  } = request;

  if (
    !workflow.shouldExecute ||
    !workflow.tool
  ) {
    return {
      session,
      executed: false,
    };
  }

  const context: ToolContext = {
    callId,
  };

  const toolResult =
    await executeTool(
      workflow.tool,
      session,
      context,
    );

  return {
    session: getSession(callId),
    toolResult,
    executed: true,
  };
}