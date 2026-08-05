// website/lib/platform/integration/crm-dispatcher.ts

import type {
  DomainEvent,
} from "./domain-event";

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * CRM Dispatcher
 *
 * Routes domain events into the CRM domain.
 * This dispatcher coordinates Lead, Opportunity,
 * Deal, Activity, Note, Pipeline, Quote, Estimate,
 * and related CRM operations.
 */

export interface CRMDispatcher {
  dispatch(
    event: DomainEvent,
  ): Promise<void>;

  supports(
    event: DomainEvent,
  ): boolean;
}

export class DefaultCRMDispatcher
  implements CRMDispatcher
{
  async dispatch(
    event: DomainEvent,
  ): Promise<void> {
    // Future implementation:
    //
    // • Create / update Leads
    // • Advance Opportunities
    // • Record Activities
    // • Generate Quotes
    // • Create Estimates
    // • Publish CRM events
    //
    // This remains intentionally
    // infrastructure-independent.

    void event;
  }

  supports(
    event: DomainEvent,
  ): boolean {
    return event.aggregateType.length > 0;
  }
}

export const crmDispatcher =
  new DefaultCRMDispatcher();