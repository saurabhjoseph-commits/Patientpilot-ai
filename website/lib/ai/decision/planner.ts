// website/lib/ai/decision/planner.ts

import type { DecisionResult } from "./types";
import type { AIToolName } from "@/lib/ai/tools";

/**
 * ============================================================
 * PatientPilot AI
 * Decision Planner
 * ============================================================
 *
 * Converts a DecisionResult into a workflow plan.
 *
 * The planner does NOT execute tools.
 * It only tells the AI service what should happen next.
 * ============================================================
 */

export interface WorkflowPlan {
  shouldAsk: boolean;

  shouldExecute: boolean;

  shouldHandoff: boolean;

  shouldComplete: boolean;

  tool?: AIToolName;

  question?: string;
}

export function createWorkflowPlan(
  decision: DecisionResult,
): WorkflowPlan {
  return {
    shouldAsk:
      decision.action === "ask",

    shouldExecute:
      decision.action === "execute",

    shouldHandoff:
      decision.action === "handoff",

    shouldComplete:
      decision.action === "complete",

    tool: decision.tool,

    question:
      decision.nextQuestion,
  };
}