/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Event Bus
 * ============================================================
 */

import type { Event } from "./Event";
import {
  EVENT_TYPES,
  type EventHandler,
  type EventRegistry,
  type EventType,
} from "./types";

import { logger } from "../logger/logger";

/**
 * In-memory event bus implementation.
 *
 * Future implementations may use:
 * - Kafka
 * - RabbitMQ
 * - Azure Service Bus
 * - AWS EventBridge
 */
export class EventBus {
  private readonly handlers: EventRegistry = {};

  /**
   * Subscribe to an event.
   *
   * Returns an unsubscribe function.
   */
  subscribe<TPayload>(
    type: EventType,
    handler: EventHandler<TPayload>
  ): () => void {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }

    this.handlers[type]!.push(handler as EventHandler);

    logger.debug("Event handler registered.", {
      eventType: type,
      handlerCount: this.handlerCount(type),
    });

    return () => {
      this.unsubscribe(type, handler);
    };
  }

  /**
   * Remove an event handler.
   */
  unsubscribe<TPayload>(
    type: EventType,
    handler: EventHandler<TPayload>
  ): void {
    const handlers = this.handlers[type];

    if (!handlers) {
      return;
    }

    this.handlers[type] = handlers.filter(
      h => h !== handler
    );

    logger.debug("Event handler removed.", {
      eventType: type,
      handlerCount: this.handlerCount(type),
    });
  }

  /**
   * Publish an event.
   */
  async publish<TPayload>(
    event: Event<TPayload>
  ): Promise<void> {
    const handlers =
      this.handlers[event.type as EventType] ?? [];

    logger.debug("Publishing event.", {
      eventType: event.type,
      handlerCount: handlers.length,
      eventId: event.id,
    });

    await Promise.all(
      handlers.map(async handler => {
        try {
          await handler(event);
        } catch (error) {
          logger.error(
            `Event handler failed: ${event.type}`,
            error instanceof Error
              ? error
              : new Error(String(error)),
            {
              eventId: event.id,
              eventType: event.type,
            }
          );
        }
      })
    );
  }

  /**
   * Remove every registered handler.
   */
  clear(): void {
    Object.keys(this.handlers).forEach(key => {
      delete this.handlers[key as EventType];
    });
  }

  /**
   * Number of handlers for one event.
   */
  handlerCount(
    type: EventType
  ): number {
    return this.handlers[type]?.length ?? 0;
  }

  /**
   * Returns true if the event has subscribers.
   */
  hasSubscribers(
    type: EventType
  ): boolean {
    return this.handlerCount(type) > 0;
  }
}

/**
 * Default application event bus.
 */
export const eventBus = new EventBus();

/**
 * Re-export event types for convenience.
 */
export { EVENT_TYPES };