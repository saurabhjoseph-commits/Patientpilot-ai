/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Canonical communication message.
 */

export type MessageStatus =
  | "draft"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "deleted";

export type MessageDirection =
  | "inbound"
  | "outbound";

export type MessageType =
  | "text"
  | "html"
  | "markdown"
  | "voice_transcript"
  | "system"
  | "event"
  | "template"
  | "custom";

export interface MessageAuthor {

  participantId: string;

  participantType:
    | "patient"
    | "staff"
    | "provider"
    | "ai_agent"
    | "system";

}

export interface MessageContent {

  subject?: string;

  body: string;

  language?: string;

  translatedBody?: string;

}

export interface MessageDelivery {

  providerMessageId?: string;

  sentAt?: string;

  deliveredAt?: string;

  readAt?: string;

  failedAt?: string;

  failureReason?: string;

}

export interface MessageMetadata {

  replyToMessageId?: string;

  externalReferenceId?: string;

  tags: string[];

}

export interface Message {

  id: string;

  tenantId: string;

  threadId: string;

  channelId: string;

  endpointId: string;

  author: MessageAuthor;

  direction: MessageDirection;

  type: MessageType;

  status: MessageStatus;

  content: MessageContent;

  delivery: MessageDelivery;

  metadata: MessageMetadata;

  createdAt: string;

  updatedAt: string;

}