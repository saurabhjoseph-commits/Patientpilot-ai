/**
 * PP-002 Milestone C
 * Global Usage Record Domain
 *
 * Represents an immutable usage event
 * or aggregated usage snapshot.
 */

export type UsageRecordStatus =
  | "recorded"
  | "processed"
  | "billed"
  | "adjusted"
  | "reversed";

export type UsageRecordType =
  | "event"
  | "aggregation"
  | "adjustment"
  | "correction";

export interface UsageRecordSource {

  source: string;

  sourceReference?: string;

}

export interface UsageRecordPeriod {

  startedAt: string;

  endedAt: string;

}

export interface UsageRecordMeasurement {

  quantity: number;

  unit: string;

}

export interface UsageRecordContext {

  subscriptionId?: string;

  invoiceId?: string;

  patientId?: string;

  providerId?: string;

  conversationId?: string;

  workflowId?: string;

}

export interface UsageRecordMetadata {

  description?: string;

  recordedBy?: string;

  tags: string[];

}

export interface UsageRecord {

  id: string;

  tenantId: string;

  clinicId?: string;

  usageMeterId: string;

  status: UsageRecordStatus;

  type: UsageRecordType;

  source: UsageRecordSource;

  period: UsageRecordPeriod;

  measurement: UsageRecordMeasurement;

  context: UsageRecordContext;

  metadata: UsageRecordMetadata;

  recordedAt: string;

  createdAt: string;

  updatedAt: string;

}