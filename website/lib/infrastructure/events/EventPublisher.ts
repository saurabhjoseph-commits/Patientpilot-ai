/**
 * ============================================================
 * PatientPilot AI
 * Event Publisher
 * ============================================================
 *
 * Infrastructure implementation of IEventPublisher.
 *
 * This implementation currently provides synchronous,
 * in-process event publishing.
 *
 * It can later evolve into:
 *
 * • RabbitMQ
 * • Azure Service Bus
 * • Kafka
 * • AWS EventBridge
 * • Google Pub/Sub
 *
 * without changing the Application Layer.
 */

import type {
  ApplicationEvent,
  IEventPublisher,
} from "@/lib/application/interfaces/IEventPublisher";

export class EventPublisher
  implements IEventPublisher
{
  async publish<TPayload>(
    event: ApplicationEvent<TPayload>,
  ): Promise<void> {
    // Future:
    // Publish to distributed event bus.

    console.info(
      `[Application Event] ${event.type}`,
      event,
    );
  }

  async publishAll(
    events: readonly ApplicationEvent[],
  ): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}