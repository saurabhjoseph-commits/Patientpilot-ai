/**
 * PatientPilot AI
 * Infrastructure Layer
 * Outbox
 *
 * Stores events that will later be delivered to external systems.
 */

import type {
  DomainEvent,
} from "./domain-event-publisher";

export interface OutboxMessage {
  readonly id: string;
  readonly event: DomainEvent;
  readonly createdAt: Date;
  readonly processed: boolean;
}

export interface Outbox {
  add(
    event: DomainEvent,
  ): Promise<OutboxMessage>;

  pending(): Promise<
    readonly OutboxMessage[]
  >;

  markProcessed(
    id: string,
  ): Promise<void>;

  clear(): Promise<void>;
}

export class InMemoryOutbox
  implements Outbox
{
  private readonly messages: OutboxMessage[] = [];

  async add(
    event: DomainEvent,
  ): Promise<OutboxMessage> {
    const message: OutboxMessage = {
      id: crypto.randomUUID(),
      event,
      createdAt: new Date(),
      processed: false,
    };

    this.messages.push(message);

    return message;
  }

  async pending(): Promise<
    readonly OutboxMessage[]
  > {
    return this.messages.filter(
      (message) => !message.processed,
    );
  }

  async markProcessed(
    id: string,
  ): Promise<void> {
    const message = this.messages.find(
      (item) => item.id === id,
    );

    if (!message) {
      return;
    }

    (
      message as {
        processed: boolean;
      }
    ).processed = true;
  }

  async clear(): Promise<void> {
    this.messages.length = 0;
  }
}

/**
 * Creates an Outbox.
 */
export function createOutbox(): Outbox {
  return new InMemoryOutbox();
}

/**
 * Shared Outbox.
 */
export const outbox =
  createOutbox();

export default outbox;