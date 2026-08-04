/**
 * PatientPilot AI
 * Infrastructure Layer
 * Event Store
 *
 * In-memory event store abstraction.
 * This can later be replaced with a persistent implementation
 * (Supabase/PostgreSQL, Kafka, EventStoreDB, etc.).
 */

import type {
  DomainEvent,
} from "./domain-event-publisher";

export interface EventStore {
  append(
    event: DomainEvent,
  ): Promise<void>;

  appendMany(
    events: readonly DomainEvent[],
  ): Promise<void>;

  getEvents(
    aggregateId: string,
  ): Promise<readonly DomainEvent[]>;

  clear(): Promise<void>;
}

export class InMemoryEventStore
  implements EventStore
{
  private readonly events: DomainEvent[] = [];

  async append(
    event: DomainEvent,
  ): Promise<void> {
    this.events.push(event);
  }

  async appendMany(
    events: readonly DomainEvent[],
  ): Promise<void> {
    this.events.push(...events);
  }

  async getEvents(
    aggregateId: string,
  ): Promise<readonly DomainEvent[]> {
    return this.events.filter(
      (event) =>
        event.aggregateId === aggregateId,
    );
  }

  async clear(): Promise<void> {
    this.events.length = 0;
  }
}

/**
 * Creates an Event Store.
 */
export function createEventStore(): EventStore {
  return new InMemoryEventStore();
}

/**
 * Shared Event Store.
 */
export const eventStore =
  createEventStore();

export default eventStore;