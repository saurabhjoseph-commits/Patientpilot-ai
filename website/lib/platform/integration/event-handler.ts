// website/lib/platform/integration/event-handler.ts

import type {
  DomainEvent,
} from "./domain-event";

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * Event Handler
 *
 * Base abstraction implemented by all
 * integration handlers.
 */

export interface EventHandler<
  TEvent extends DomainEvent = DomainEvent,
> {
  readonly eventType: string;

  canHandle(
    event: DomainEvent,
  ): boolean;

  handle(
    event: TEvent,
  ): Promise<void>;
}

export abstract class BaseEventHandler<
  TEvent extends DomainEvent = DomainEvent,
> implements EventHandler<TEvent>
{
  abstract readonly eventType: string;

  canHandle(
    event: DomainEvent,
  ): boolean {
    return (
      event.type ===
      this.eventType
    );
  }

  async handle(
    event: TEvent,
  ): Promise<void> {
    await this.execute(event);
  }

  protected abstract execute(
    event: TEvent,
  ): Promise<void>;
}

export class CompositeEventHandler
  implements EventHandler
{
  readonly eventType = "*";

  constructor(
    private readonly handlers: EventHandler[],
  ) {}

  canHandle(): boolean {
    return true;
  }

  async handle(
    event: DomainEvent,
  ): Promise<void> {
    for (const handler of this.handlers) {
      if (
        handler.canHandle(
          event,
        )
      ) {
        await handler.handle(
          event,
        );
      }
    }
  }
}