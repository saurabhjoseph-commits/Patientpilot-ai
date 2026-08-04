// website/lib/platform/integration/followup-dispatcher.ts

import type {
  DomainEvent,
} from "./domain-event";

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * Follow-up Dispatcher
 *
 * Routes domain events into the Follow-up
 * domain to create and manage patient
 * follow-up workflows.
 */

export interface FollowUpDispatcher {
  dispatch(
    event: DomainEvent,
  ): Promise<void>;

  supports(
    event: DomainEvent,
  ): boolean;
}

export class DefaultFollowUpDispatcher
  implements FollowUpDispatcher
{
  async dispatch(
    event: DomainEvent,
  ): Promise<void> {
    // Future implementation:
    //
    // • Evaluate follow-up rules
    // • Create follow-up record
    // • Schedule execution
    // • Publish FollowUpScheduled event
    //
    // Infrastructure integration will
    // be added in a later milestone.

    void event;
  }

  supports(
    event: DomainEvent,
  ): boolean {
    return event.aggregateType.length > 0;
  }
}

export const followUpDispatcher =
  new DefaultFollowUpDispatcher();