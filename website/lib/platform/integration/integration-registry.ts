// website/lib/platform/integration/integration-registry.ts

import type { DomainEvent } from "./domain-event";
import type { WorkflowDispatcher } from "./workflow-dispatcher";
import type { NotificationDispatcher } from "./notification-dispatcher";
import type { FollowUpDispatcher } from "./followup-dispatcher";
import type { CRMDispatcher } from "./crm-dispatcher";
import type { AIDispatcher } from "./ai-dispatcher";

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * Integration Registry
 *
 * Coordinates all dispatchers and routes
 * domain events to the appropriate subsystems.
 */

export interface IntegrationRegistry {
  dispatch(
    event: DomainEvent,
  ): Promise<void>;
}

export class DefaultIntegrationRegistry
  implements IntegrationRegistry
{
  constructor(
    private readonly workflowDispatcher: WorkflowDispatcher,
    private readonly notificationDispatcher: NotificationDispatcher,
    private readonly followUpDispatcher: FollowUpDispatcher,
    private readonly crmDispatcher: CRMDispatcher,
    private readonly aiDispatcher: AIDispatcher,
  ) {}

  async dispatch(
    event: DomainEvent,
  ): Promise<void> {
    const dispatchers = [
      this.workflowDispatcher,
      this.notificationDispatcher,
      this.followUpDispatcher,
      this.crmDispatcher,
      this.aiDispatcher,
    ];

    for (const dispatcher of dispatchers) {
      if (dispatcher.supports(event)) {
        await dispatcher.dispatch(event);
      }
    }
  }
}