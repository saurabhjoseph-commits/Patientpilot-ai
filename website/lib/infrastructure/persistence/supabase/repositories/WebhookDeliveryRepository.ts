import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  IWebhookDeliveryRepository,
  WebhookDeliveryClaim,
  WebhookDeliveryClaimResult,
} from "@/lib/application/interfaces/IWebhookDeliveryRepository";

export class WebhookDeliveryRepository implements IWebhookDeliveryRepository {
  constructor(private readonly db: SupabaseClient) {}

  async claim(input: WebhookDeliveryClaim): Promise<WebhookDeliveryClaimResult> {
    const { data, error } = await this.db
      .from("webhook_deliveries")
      .insert({
        provider: input.provider,
        fingerprint: input.fingerprint,
        route: input.route,
        call_sid: input.callSid ?? null,
        received_at: input.receivedAt.toISOString(),
        expires_at: input.expiresAt.toISOString(),
        status: "processing",
      })
      .select("id")
      .single();

    if (error?.code === "23505") return { claimed: false };
    if (error) throw error;
    return { claimed: true, deliveryId: data.id };
  }

  async markCompleted(deliveryId: string, completedAt: Date): Promise<void> {
    const { error } = await this.db
      .from("webhook_deliveries")
      .update({ status: "completed", completed_at: completedAt.toISOString(), failure_code: null })
      .eq("id", deliveryId)
      .eq("status", "processing");
    if (error) throw error;
  }

  async markFailed(deliveryId: string, failureCode: string): Promise<void> {
    const { error } = await this.db
      .from("webhook_deliveries")
      .update({ status: "failed", failure_code: failureCode.slice(0, 120) })
      .eq("id", deliveryId)
      .eq("status", "processing");
    if (error) throw error;
  }

  async deleteExpired(before: Date): Promise<number> {
    const { data, error } = await this.db
      .from("webhook_deliveries")
      .delete()
      .lt("expires_at", before.toISOString())
      .select("id");
    if (error) throw error;
    return data?.length ?? 0;
  }
}
