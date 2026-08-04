import {
  WorkflowDefinition,
  WorkflowEngine,
  WorkflowEngineError,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from "../contracts/workflow-engine";

import {
  RuleEngine,
} from "../contracts/rule-engine";

import { ruleEngine } from "./rule-engine";

/**
 * Default runtime implementation of the Workflow Engine.
 *
 * The Workflow Engine is responsible for:
 * - registering workflows
 * - selecting workflows for incoming events
 * - evaluating workflow rules
 * - tracking completed steps
 *
 * Action execution, retries, branching and persistence are
 * intentionally deferred to later milestones.
 */
export class DefaultWorkflowEngine
  implements WorkflowEngine
{
  private readonly workflows = new Map<
    string,
    WorkflowDefinition
  >();

  constructor(
    private readonly rules: RuleEngine = ruleEngine,
  ) {}

  register(
    workflow: WorkflowDefinition,
  ): void {
    if (this.workflows.has(workflow.id)) {
      throw new WorkflowEngineError(
        `Workflow "${workflow.id}" is already registered.`,
      );
    }

    this.workflows.set(
      workflow.id,
      Object.freeze(workflow),
    );
  }

  unregister(
    workflowId: string,
  ): boolean {
    return this.workflows.delete(workflowId);
  }

  list(): readonly WorkflowDefinition[] {
    return Object.freeze(
      [...this.workflows.values()],
    );
  }

  execute(
    context: WorkflowExecutionContext,
  ): readonly WorkflowExecutionResult[] {
    const results: WorkflowExecutionResult[] = [];

    for (const workflow of this.list()) {
      if (!workflow.enabled) {
        continue;
      }

      const completedSteps: string[] = [];

      for (const step of workflow.steps) {
        if (step.event !== context.event) {
          continue;
        }

        let allowed = true;

        if (
          step.rules &&
          step.rules.length > 0
        ) {
          const evaluations =
            this.rules.execute({
              variables: context.data ?? {},
            });

          allowed = evaluations.every(
            (result) => result.success,
          );
        }

        if (!allowed) {
          continue;
        }

        completedSteps.push(step.id);
      }

      if (completedSteps.length === 0) {
        continue;
      }

      results.push({
        success: true,
        workflowId: workflow.id,
        completedSteps: Object.freeze(
          [...completedSteps],
        ),
      });
    }

    return Object.freeze(results);
  }

  clear(): void {
    this.workflows.clear();
  }
}

/**
 * Creates a new Workflow Engine.
 */
export function createWorkflowEngine(
  rules: RuleEngine = ruleEngine,
): WorkflowEngine {
  return new DefaultWorkflowEngine(
    rules,
  );
}

/**
 * Shared platform Workflow Engine.
 */
export const workflowEngine: WorkflowEngine =
  createWorkflowEngine();

/**
 * Default Workflow Engine.
 */
export default workflowEngine;