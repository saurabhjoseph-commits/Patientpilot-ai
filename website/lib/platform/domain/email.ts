/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Represents an email transport session.
 */

export type EmailStatus =
  | "draft"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "failed"
  | "cancelled";

export type EmailDirection =
  | "inbound"
  | "outbound";

export interface EmailAddress {

  email: string;

  displayName?: string;

}

export interface EmailRecipients {

  from: EmailAddress;

  to: EmailAddress[];

  cc: EmailAddress[];

  bcc: EmailAddress[];

  replyTo?: EmailAddress;

}

export interface EmailThreading {

  messageId: string;

  inReplyTo?: string;

  references: string[];

}

export interface EmailProvider {

  providerId?: string;

  integrationId?: string;

  providerMessageId?: string;

}

export interface EmailDelivery {

  queuedAt?: string;

  sentAt?: string;

  deliveredAt?: string;

  openedAt?: string;

  clickedAt?: string;

  bouncedAt?: string;

  failureReason?: string;

}

export interface EmailMetadata {

  subject: string;

  priority?: "low" | "normal" | "high";

  hasAttachments: boolean;

  tags: string[];

}

export interface Email {

  id: string;

  tenantId: string;

  conversationId: string;

  threadId: string;

  messageId: string;

  direction: EmailDirection;

  status: EmailStatus;

  recipients: EmailRecipients;

  threading: EmailThreading;

  provider: EmailProvider;

  delivery: EmailDelivery;

  metadata: EmailMetadata;

  createdAt: string;

  updatedAt: string;

}