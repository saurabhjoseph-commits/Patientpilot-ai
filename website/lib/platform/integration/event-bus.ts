// website/lib/platform/integration/event-bus.ts

import type {
  DomainEvent,
} from "./domain-event";

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * Event Bus
 *
 * In-memory implementation that can later be
 * replaced by Kafka, RabbitMQ, Azure Service Bus,
 * AWS EventBridge, etc.
 */

export type EventHandler<
  TEvent extends DomainEvent = DomainEvent,
> = (
  event: TEvent,
) => Promise<void> | void;

export interface EventBus {
  publish(
    event: DomainEvent,
  ): Promise<void>;

  publishMany(
    events: DomainEvent[],
  ): Promise<void>;

  subscribe(
    eventType: string,
    handler: EventHandler,
  ): void;

  unsubscribe(
    eventType: string,
    handler: EventHandler,
  ): void;
}

export class InMemoryEventBus
  implements EventBus
{
  private readonly handlers =
    new Map<
      string,
      Set<EventHandler>
    >();

  async publish(
    event: DomainEvent,
  ): Promise<void> {
    const handlers =
      this.handlers.get(
        event.type,
      );

    if (!handlers) {
      return;
    }

    for (const handler of handlers) {
      await handler(event);
    }
  }

  async publishMany(
    events: DomainEvent[],
  ): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  subscribe(
    eventType: string,
    handler: EventHandler,
  ): void {
    if (
      !this.handlers.has(
        eventType,
      )
    ) {
      this.handlers.set(
        eventType,
        new Set(),
      );
    }

    this.handlers
      .get(eventType)!
      .add(handler);
  }

  unsubscribe(
    eventType: string,
    handler: EventHandler,
  ): void {
    this.handlers
      .get(eventType)
      ?.delete(handler);
  }
}

export const eventBus =
  new InMemoryEventBus();