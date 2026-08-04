import type {
  IWebhookDeliveryRepository,
  WebhookDeliveryClaim,
  WebhookDeliveryClaimResult,
} from "@/lib/application/interfaces/IWebhookDeliveryRepository";

export class WebhookDeliveryService {
  constructor(private readonly deliveries: IWebhookDeliveryRepository) {}

  claim(input: WebhookDeliveryClaim): Promise<WebhookDeliveryClaimResult> {
    return this.deliveries.claim(input);
  }

  markCompleted(deliveryId: string): Promise<void> {
    return this.deliveries.markCompleted(deliveryId, new Date());
  }

  markFailed(deliveryId: string, failureCode: string): Promise<void> {
    return this.deliveries.markFailed(deliveryId, failureCode);
  }

  cleanupExpired(): Promise<number> {
    return this.deliveries.deleteExpired(new Date());
  }
}
