export type WebhookDeliveryStatus = "processing" | "completed" | "failed";

export interface WebhookDeliveryClaim {
  readonly provider: "twilio";
  readonly fingerprint: string;
  readonly route: string;
  readonly callSid?: string;
  readonly receivedAt: Date;
  readonly expiresAt: Date;
}

export interface WebhookDeliveryClaimResult {
  readonly claimed: boolean;
  readonly deliveryId?: string;
}

export interface IWebhookDeliveryRepository {
  claim(input: WebhookDeliveryClaim): Promise<WebhookDeliveryClaimResult>;
  markCompleted(deliveryId: string, completedAt: Date): Promise<void>;
  markFailed(deliveryId: string, failureCode: string): Promise<void>;
  deleteExpired(before: Date): Promise<number>;
}
