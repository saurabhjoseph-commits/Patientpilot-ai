/**
 * ============================================================
 * PatientPilot AI
 * Notification Domain Types
 * ============================================================
 */

export type NotificationChannel =
  | "email"
  | "sms"
  | "whatsapp"
  | "voice"
  | "push"
  | "webhook";

export type NotificationStatus =
  | "pending"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "failed"
  | "cancelled";

export type NotificationPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type NotificationProvider =
  | "sendgrid"
  | "resend"
  | "twilio"
  | "telnyx"
  | "meta"
  | "firebase"
  | "custom";

export interface NotificationRecipient {
  customerId?: string;

  leadId?: string;

  name?: string;

  email?: string;

  phone?: string;

  pushToken?: string;
}

export interface NotificationContent {
  subject?: string;

  title?: string;

  body: string;

  html?: string;

  templateId?: string;

  variables?: Record<string, unknown>;
}

export interface NotificationDelivery {
  provider: NotificationProvider;

  providerMessageId?: string;

  attempts: number;

  lastAttemptAt?: Date;

  scheduledFor?: Date;

  sentAt?: Date;

  deliveredAt?: Date;

  failureReason?: string;
}

export interface NotificationMetadata {
  followUpId?: string;

  appointmentId?: string;

  campaignId?: string;

  conversationId?: string;

  workflowId?: string;

  tags?: string[];
}

export interface Notification {
  id: string;

  tenantId: string;

  channel: NotificationChannel;

  status: NotificationStatus;

  priority: NotificationPriority;

  recipient: NotificationRecipient;

  content: NotificationContent;

  delivery: NotificationDelivery;

  metadata: NotificationMetadata;

  createdAt: Date;

  updatedAt: Date;
}