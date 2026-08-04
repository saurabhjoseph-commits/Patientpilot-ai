import {
  EventBus,
  EventHandler,
  EventName,
  EventPublishOptions,
  EventSubscription,
  PlatformEvent,
} from "../contracts/event-bus";

/**
 * Runtime implementation of the platform event bus.
 */
export class DefaultEventBus implements EventBus {
  /**
   * Registered event handlers.
   */
  private readonly handlers = new Map<
    EventName,
    Set<EventHandler>
  >();

  constructor() {}

  /**
   * Registers a handler for an event.
   */
  subscribe(
    eventName: EventName,
    handler: EventHandler,
  ): EventSubscription {
    let handlers = this.handlers.get(eventName);

    if (!handlers) {
      handlers = new Set<EventHandler>();
      this.handlers.set(eventName, handlers);
    }

    handlers.add(handler);

    return {
      eventName,
      unsubscribe: () => {
        this.unsubscribe(eventName, handler);
      },
    };
  }

  /**
   * Removes a registered handler.
   */
  unsubscribe(
    eventName: EventName,
    handler: EventHandler,
  ): boolean {
    const handlers = this.handlers.get(eventName);

    if (!handlers) {
      return false;
    }

    const removed = handlers.delete(handler);

    if (handlers.size === 0) {
      this.handlers.delete(eventName);
    }

    return removed;
  }

  /**
   * Publishes an event to all subscribed handlers.
   */
  async publish(
    event: PlatformEvent,
    options: EventPublishOptions = {},
  ): Promise<void> {
    const handlers = this.handlers.get(event.name);

    if (!handlers || handlers.size === 0) {
      return;
    }

    const {
      sequential = false,
      continueOnError = true,
    } = options;

    const handlerList = [...handlers];

    if (sequential) {
      for (const handler of handlerList) {
        try {
          await handler(event);
        } catch (error) {
          if (!continueOnError) {
            throw error;
          }
        }
      }

      return;
    }

    const executions = handlerList.map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        if (!continueOnError) {
          throw error;
        }
      }
    });

    await Promise.all(executions);
  }

  /**
   * Removes every registered handler.
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Returns the number of registered handlers.
   */
  handlerCount(
    eventName?: EventName,
  ): number {
    if (eventName) {
      return this.handlers.get(eventName)?.size ?? 0;
    }

    let total = 0;

    for (const handlers of this.handlers.values()) {
      total += handlers.size;
    }

    return total;
  }
}

/**
 * Creates a new Event Bus instance.
 */
export function createEventBus(): EventBus {
  return new DefaultEventBus();
}

/**
 * Shared platform Event Bus singleton.
 */
export const eventBus: EventBus =
  createEventBus();

/**
 * Default Event Bus.
 */
export default eventBus;