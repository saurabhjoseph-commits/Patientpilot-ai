/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Represents an SMS/MMS transport session.
 */

export type SMSStatus =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "undelivered"
  | "expired";

export type SMSDirection =
  | "inbound"
  | "outbound";

export type SMSType =
  | "sms"
  | "mms"
  | "rcs";

export interface SMSPhoneNumber {

  e164: string;

  display?: string;

}

export interface SMSParticipants {

  from: SMSPhoneNumber;

  to: SMSPhoneNumber;

}

export interface SMSProvider {

  providerId?: string;

  integrationId?: string;

  providerMessageId?: string;

  providerConversationId?: string;

}

export interface SMSDelivery {

  queuedAt?: string;

  sentAt?: string;

  deliveredAt?: string;

  readAt?: string;

  failedAt?: string;

  failureReason?: string;

}

export interface SMSMetadata {

  type: SMSType;

  segmentCount?: number;

  hasMedia: boolean;

  mediaCount?: number;

  tags: string[];

}

export interface SMS {

  id: string;

  tenantId: string;

  conversationId: string;

  threadId: string;

  messageId: string;

  direction: SMSDirection;

  status: SMSStatus;

  participants: SMSParticipants;

  provider: SMSProvider;

  delivery: SMSDelivery;

  metadata: SMSMetadata;

  createdAt: string;

  updatedAt: string;

}