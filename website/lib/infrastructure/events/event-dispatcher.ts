/**
 * PatientPilot AI
 * Infrastructure Layer
 * Event Dispatcher
 *
 * Dispatches one or more domain events.
 */

import type {
  DomainEvent,
} from "./domain-event-publisher";

import {
  domainEventPublisher,
} from "./domain-event-publisher";

export interface EventDispatcher {
  dispatch(
    event: DomainEvent,
  ): Promise<void>;

  dispatchAll(
    events: readonly DomainEvent[],
  ): Promise<void>;
}

export class DefaultEventDispatcher
  implements EventDispatcher
{
  async dispatch(
    event: DomainEvent,
  ): Promise<void> {
    await domainEventPublisher.publish(event);
  }

  async dispatchAll(
    events: readonly DomainEvent[],
  ): Promise<void> {
    if (events.length === 0) {
      return;
    }

    await domainEventPublisher.publishMany(events);
  }
}

/**
 * Creates an Event Dispatcher.
 */
export function createEventDispatcher(): EventDispatcher {
  return new DefaultEventDispatcher();
}

/**
 * Shared Event Dispatcher.
 */
export const eventDispatcher =
  createEventDispatcher();

export default eventDispatcher;