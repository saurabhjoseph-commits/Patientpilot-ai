// website/lib/platform/integration/ai-dispatcher.ts

import type {
  DomainEvent,
} from "./domain-event";

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * AI Dispatcher
 *
 * Routes domain events into the AI services layer.
 * This dispatcher coordinates conversation analysis,
 * intent detection, memory updates, response generation,
 * summarization, and future AI capabilities.
 */

export interface AIDispatcher {
  dispatch(
    event: DomainEvent,
  ): Promise<void>;

  supports(
    event: DomainEvent,
  ): boolean;
}

export class DefaultAIDispatcher
  implements AIDispatcher
{
  async dispatch(
    event: DomainEvent,
  ): Promise<void> {
    // Future implementation:
    //
    // • Execute conversation workflows
    // • Detect intent
    // • Update AI memory
    // • Generate responses
    // • Produce summaries
    // • Publish AI events
    //
    // The implementation remains
    // infrastructure-independent.

    void event;
  }

  supports(
    event: DomainEvent,
  ): boolean {
    return event.aggregateType.length > 0;
  }
}

export const aiDispatcher =
  new DefaultAIDispatcher();