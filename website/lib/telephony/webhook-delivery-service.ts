import "server-only";

import { WebhookDeliveryService } from "@/lib/application/services/WebhookDeliveryService";
import { WebhookDeliveryRepository } from "@/lib/infrastructure/persistence/supabase/repositories/WebhookDeliveryRepository";
import { supabaseServer } from "@/lib/supabase-server";

export function createWebhookDeliveryService(): WebhookDeliveryService {
  return new WebhookDeliveryService(new WebhookDeliveryRepository(supabaseServer));
}
