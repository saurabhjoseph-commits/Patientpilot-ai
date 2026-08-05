/**
 * PP-004 Communication & Engagement Domain
 *
 * Represents a communication channel
 * configured for a clinic.
 *
 * Examples:
 * - Twilio Voice
 * - Twilio SMS
 * - SendGrid Email
 * - WhatsApp Business
 * - Patient Portal
 */

export type CommunicationChannelType =
  | "phone"
  | "sms"
  | "email"
  | "web_chat"
  | "patient_portal"
  | "mobile_app"
  | "whatsapp"
  | "api"
  | "custom";

export type CommunicationChannelProvider =
  | "twilio"
  | "telnyx"
  | "sendgrid"
  | "mailgun"
  | "whatsapp_business"
  | "firebase"
  | "internal"
  | "custom";

export type CommunicationChannelStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "disabled";

export interface CommunicationChannelConfiguration {

  provider: CommunicationChannelProvider;

  providerAccountId?: string;

  endpoint?: string;

  settings?: Record<string, string>;

}

export interface CommunicationChannelCapabilities {

  supportsInbound: boolean;

  supportsOutbound: boolean;

  supportsAttachments: boolean;

  supportsReadReceipts: boolean;

  supportsTypingIndicators: boolean;

}

export interface CommunicationChannelMetadata {

  description?: string;

  externalId?: string;

}

export interface CommunicationChannel {

  id: string;

  tenantId: string;

  clinicId: string;

  name: string;

  type: CommunicationChannelType;

  status: CommunicationChannelStatus;

  configuration: CommunicationChannelConfiguration;

  capabilities: CommunicationChannelCapabilities;

  metadata: CommunicationChannelMetadata;

  createdAt: string;

  updatedAt: string;

}