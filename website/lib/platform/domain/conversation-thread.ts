/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Represents a communication thread within
 * a business conversation.
 */

export type ConversationThreadStatus =
  | "active"
  | "waiting"
  | "closed"
  | "archived";

export type ConversationThreadDirection =
  | "inbound"
  | "outbound"
  | "bidirectional";

export interface ConversationThreadParticipants {

  patientId?: string;

  clinicId?: string;

  assignedUserId?: string;

  assignedAgentId?: string;

}

export interface ConversationThreadChannel {

  channelId: string;

  endpointId: string;

}

export interface ConversationThreadMetrics {

  messageCount: number;

  unreadMessageCount: number;

  firstMessageAt?: string;

  lastMessageAt?: string;

}

export interface ConversationThreadMetadata {

  subject?: string;

  language?: string;

  tags: string[];

}

export interface ConversationThread {

  id: string;

  tenantId: string;

  conversationId: string;

  status: ConversationThreadStatus;

  direction: ConversationThreadDirection;

  participants: ConversationThreadParticipants;

  channel: ConversationThreadChannel;

  metrics: ConversationThreadMetrics;

  metadata: ConversationThreadMetadata;

  createdAt: string;

  updatedAt: string;

}