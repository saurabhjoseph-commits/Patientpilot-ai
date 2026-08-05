// website/lib/platform/integration/workflow-dispatcher.ts

import type {
  DomainEvent,
} from "./domain-event";

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * Workflow Dispatcher
 *
 * Routes domain events into the Workflow Engine.
 */

export interface WorkflowDispatcher {
  dispatch(
    event: DomainEvent,
  ): Promise<void>;

  supports(
    event: DomainEvent,
  ): boolean;
}

export class DefaultWorkflowDispatcher
  implements WorkflowDispatcher
{
  async dispatch(
    event: DomainEvent,
  ): Promise<void> {
    // Future implementation:
    //
    // 1. Locate active workflow triggers
    // 2. Match trigger conditions
    // 3. Create WorkflowExecution
    // 4. Execute first workflow step
    //
    // This placeholder intentionally keeps
    // the integration layer decoupled from
    // the workflow engine.
    void event;
  }

  supports(
    event: DomainEvent,
  ): boolean {
    return (
      event.aggregateType.length >
      0
    );
  }
}

export const workflowDispatcher =
  new DefaultWorkflowDispatcher();