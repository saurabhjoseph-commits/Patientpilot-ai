/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Defines a communication channel that
 * can be used for patient interactions.
 */

export type ChannelStatus =
  | "draft"
  | "active"
  | "inactive"
  | "maintenance"
  | "retired";

export type ChannelType =
  | "voice"
  | "sms"
  | "email"
  | "web_chat"
  | "live_chat"
  | "whatsapp"
  | "facebook_messenger"
  | "instagram"
  | "apple_messages"
  | "google_business_messages"
  | "custom";

export interface ChannelCapabilities {

  supportsInbound: boolean;

  supportsOutbound: boolean;

  supportsAttachments: boolean;

  supportsTypingIndicators: boolean;

  supportsReadReceipts: boolean;

  supportsTemplates: boolean;

  supportsAiAutomation: boolean;

}

export interface ChannelConfiguration {

  providerId?: string;

  integrationId?: string;

  externalChannelId?: string;

  timezone?: string;

  locale?: string;

}

export interface ChannelLimits {

  maximumMessageLength?: number;

  maximumAttachmentSizeBytes?: number;

  maximumAttachments?: number;

}

export interface ChannelMetadata {

  description?: string;

  tags: string[];

}

export interface Channel {

  id: string;

  tenantId: string;

  name: string;

  type: ChannelType;

  status: ChannelStatus;

  capabilities: ChannelCapabilities;

  configuration: ChannelConfiguration;

  limits: ChannelLimits;

  metadata: ChannelMetadata;

  createdAt: string;

  updatedAt: string;

}