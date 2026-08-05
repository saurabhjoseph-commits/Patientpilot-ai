/**
 * PP-002 Milestone E
 * Communication & Omnichannel Domain
 *
 * Represents a voice communication session.
 */

export type CallStatus =
  | "initiated"
  | "ringing"
  | "answered"
  | "in_progress"
  | "on_hold"
  | "transferring"
  | "completed"
  | "failed"
  | "busy"
  | "no_answer"
  | "cancelled";

export type CallDirection =
  | "inbound"
  | "outbound";

export type CallEndReason =
  | "completed"
  | "caller_hangup"
  | "receiver_hangup"
  | "busy"
  | "timeout"
  | "failed"
  | "transferred"
  | "system";

export interface CallProvider {

  providerId?: string;

  integrationId?: string;

  providerCallId?: string;

  providerSessionId?: string;

}

export interface CallTiming {

  initiatedAt: string;

  ringingAt?: string;

  answeredAt?: string;

  endedAt?: string;

  durationSeconds?: number;

  talkTimeSeconds?: number;

  holdTimeSeconds?: number;

}

export interface CallRouting {

  channelId: string;

  endpointId: string;

  assignedUserId?: string;

  assignedAgentId?: string;

}

export interface CallQuality {

  recordingEnabled: boolean;

  transcriptionEnabled: boolean;

  averageLatencyMs?: number;

  averagePacketLossPercent?: number;

  averageJitterMs?: number;

}

export interface CallMetadata {

  callerNumber?: string;

  receiverNumber?: string;

  endReason?: CallEndReason;

  notes?: string;

  tags: string[];

}

export interface Call {

  id: string;

  tenantId: string;

  conversationId: string;

  threadId: string;

  status: CallStatus;

  direction: CallDirection;

  provider: CallProvider;

  timing: CallTiming;

  routing: CallRouting;

  quality: CallQuality;

  metadata: CallMetadata;

  createdAt: string;

  updatedAt: string;

}