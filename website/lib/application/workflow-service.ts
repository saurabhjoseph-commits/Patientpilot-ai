/**
 * PatientPilot AI
 * Application Layer
 * Workflow Service
 *
 * Coordinates execution of business workflows using
 * the Platform Runtime.
 */

import {
  WorkflowEngine,
  WorkflowExecutionContext,
  WorkflowExecutionResult,
} from "../platform/contracts/workflow-engine";

import {
  EventBus,
} from "../platform/contracts/event-bus";

import {
  workflowEngine,
} from "../platform/runtime/workflow-engine";

import {
  eventBus,
} from "../platform/runtime/event-bus";

export interface WorkflowService {
  execute(
    context: WorkflowExecutionContext,
  ): Promise<
    readonly WorkflowExecutionResult[]
  >;
}

export class DefaultWorkflowService
  implements WorkflowService
{
  constructor(
    private readonly workflows: WorkflowEngine =
      workflowEngine,
    private readonly events: EventBus =
      eventBus,
  ) {}

  async execute(
    context: WorkflowExecutionContext,
  ): Promise<
    readonly WorkflowExecutionResult[]
  > {
    // Future milestones:
    // - Publish WorkflowStarted event
    // - Persist execution history
    // - Execute retry policies
    // - Support compensation workflows

    void this.events;

    return this.workflows.execute(context);
  }
}

/**
 * Creates a Workflow Service.
 */
export function createWorkflowService(): WorkflowService {
  return new DefaultWorkflowService();
}

/**
 * Shared Workflow Service.
 */
export const workflowService =
  createWorkflowService();

/**
 * Default Workflow Service.
 */
export default workflowService;