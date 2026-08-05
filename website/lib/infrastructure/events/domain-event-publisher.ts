/**
 * PatientPilot AI
 * Infrastructure Layer
 * Domain Event Publisher
 *
 * Publishes domain events to the Platform Runtime Event Bus.
 */

import {
  eventBus,
} from "@/lib/platform/runtime/event-bus";

export interface DomainEvent {
  /**
   * Domain event type.
   * Example:
   * Lead.Created
   * Appointment.Booked
   */
  readonly type: string;

  /**
   * Aggregate root identifier.
   */
  readonly aggregateId: string;

  /**
   * Event occurrence time.
   */
  readonly occurredAt: Date;

  /**
   * Event payload.
   */
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface DomainEventPublisher {
  publish(
    event: DomainEvent,
  ): Promise<void>;

  publishMany(
    events: readonly DomainEvent[],
  ): Promise<void>;
}

/**
 * Default implementation that bridges Domain Events
 * to the Platform Event Bus.
 */
export class DefaultDomainEventPublisher
  implements DomainEventPublisher
{
  async publish(
    event: DomainEvent,
  ): Promise<void> {
    await eventBus.publish({
      id: crypto.randomUUID(),

      name: event.type,

      version: "1.0",

      occurredAt: event.occurredAt,

      payload: {
        aggregateId: event.aggregateId,
        ...event.payload,
      },
    });
  }

  async publishMany(
    events: readonly DomainEvent[],
  ): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}

/**
 * Creates a Domain Event Publisher.
 */
export function createDomainEventPublisher(): DomainEventPublisher {
  return new DefaultDomainEventPublisher();
}

/**
 * Shared Domain Event Publisher.
 */
export const domainEventPublisher =
  createDomainEventPublisher();

/**
 * Default Domain Event Publisher.
 */
export default domainEventPublisher;