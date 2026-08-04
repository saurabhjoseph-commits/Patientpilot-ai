/**
 * PP-004 Communication & Engagement Domain
 *
 * Represents a single immutable message
 * or communication event belonging to
 * a conversation.
 */

export type ConversationMessageType =
  | "text"
  | "voice"
  | "email"
  | "system"
  | "ai"
  | "attachment"
  | "event"
  | "other";

export type ConversationMessageDirection =
  | "inbound"
  | "outbound";

export type ConversationMessageStatus =
  | "draft"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "cancelled";

export type ConversationMessageSenderType =
  | "patient"
  | "lead"
  | "customer"
  | "staff"
  | "provider"
  | "ai_agent"
  | "system"
  | "external";

export interface ConversationMessageReference {

  conversationId: string;

  parentMessageId?: string;

}

export interface ConversationMessageSender {

  senderType: ConversationMessageSenderType;

  senderId?: string;

}

export interface ConversationMessageRecipient {

  recipientType: ConversationMessageSenderType;

  recipientId?: string;

}

export interface ConversationMessageContent {

  text?: string;

  transcript?: string;

  attachmentIds?: string[];

}

export interface ConversationMessageDelivery {

  channel: string;

  externalMessageId?: string;

  sentAt?: string;

  deliveredAt?: string;

  readAt?: string;

}

export interface ConversationMessageMetadata {

  notes?: string;

  externalId?: string;

}

export interface ConversationMessage {

  id: string;

  tenantId: string;

  clinicId: string;

  type: ConversationMessageType;

  direction: ConversationMessageDirection;

  status: ConversationMessageStatus;

  reference: ConversationMessageReference;

  sender: ConversationMessageSender;

  recipient: ConversationMessageRecipient;

  content: ConversationMessageContent;

  delivery: ConversationMessageDelivery;

  metadata: ConversationMessageMetadata;

  createdAt: string;

  updatedAt: string;

}