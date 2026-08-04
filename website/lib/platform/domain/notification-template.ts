/**
 * PP-004 Communication & Engagement Domain
 *
 * Aggregate root representing
 * a reusable notification template.
 *
 * Templates define reusable content
 * for notifications across channels.
 */

export type NotificationTemplateCategory =
  | "appointment_confirmation"
  | "appointment_reminder"
  | "appointment_cancellation"
  | "appointment_reschedule"
  | "recall"
  | "follow_up"
  | "billing"
  | "payment_receipt"
  | "verification"
  | "marketing"
  | "survey"
  | "review_request"
  | "system"
  | "custom";

export type NotificationTemplateChannel =
  | "sms"
  | "email"
  | "voice"
  | "whatsapp"
  | "patient_portal"
  | "mobile_app"
  | "web_chat";

export type NotificationTemplateStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export interface NotificationTemplateContent {

  subject?: string;

  title?: string;

  body: string;

}

export interface NotificationTemplateLocalization {

  language: string;

  locale?: string;

}

export interface NotificationTemplateVersion {

  version: number;

  previousTemplateId?: string;

}

export interface NotificationTemplateVariables {

  placeholders: string[];

}

export interface NotificationTemplateMetadata {

  description?: string;

  externalId?: string;

}

export interface NotificationTemplate {

  id: string;

  tenantId: string;

  clinicId: string;

  name: string;

  category: NotificationTemplateCategory;

  channel: NotificationTemplateChannel;

  status: NotificationTemplateStatus;

  localization: NotificationTemplateLocalization;

  content: NotificationTemplateContent;

  variables: NotificationTemplateVariables;

  version: NotificationTemplateVersion;

  metadata: NotificationTemplateMetadata;

  createdAt: string;

  updatedAt: string;

}