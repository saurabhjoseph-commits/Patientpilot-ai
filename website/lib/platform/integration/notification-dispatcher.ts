// website/lib/platform/integration/notification-dispatcher.ts

import type {
  DomainEvent,
} from "./domain-event";

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 * Notification Dispatcher
 *
 * Routes domain events to the Notification
 * domain for delivery through SMS, Email,
 * Voice, WhatsApp, Push, and future channels.
 */

export interface NotificationDispatcher {
  dispatch(
    event: DomainEvent,
  ): Promise<void>;

  supports(
    event: DomainEvent,
  ): boolean;
}

export class DefaultNotificationDispatcher
  implements NotificationDispatcher
{
  async dispatch(
    event: DomainEvent,
  ): Promise<void> {
    // Future implementation:
    //
    // • Resolve notification rules
    // • Build notification request
    // • Select delivery provider
    // • Queue notification
    // • Publish NotificationCreated event
    //
    // Left intentionally empty until
    // infrastructure adapters are added.

    void event;
  }

  supports(
    event: DomainEvent,
  ): boolean {
    return event.aggregateType.length > 0;
  }
}

export const notificationDispatcher =
  new DefaultNotificationDispatcher();