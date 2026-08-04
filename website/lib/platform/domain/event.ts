/**
 * PP-002 Milestone C
 * Global Event Domain
 *
 * Represents a business event generated
 * by the platform.
 */

export type EventStatus =
  | "pending"
  | "published"
  | "processed"
  | "failed"
  | "cancelled";

export type EventSource =
  | "system"
  | "user"
  | "ai"
  | "integration"
  | "scheduler"
  | "webhook";

export interface EventActor {

  type: EventSource;

  id?: string;

  name?: string;

}

export interface EventResource {

  type: string;

  id: string;

}

export interface EventPayload {

  version: string;

  data: Record<string, unknown>;

}

export interface EventMetadata {

  correlationId?: string;

  requestId?: string;

  traceId?: string;

  parentEventId?: string;

}

export interface Event {

  id: string;

  tenantId: string;

  clinicId?: string;

  status: EventStatus;

  name: string;

  actor: EventActor;

  resource: EventResource;

  payload: EventPayload;

  metadata: EventMetadata;

  occurredAt: string;

  createdAt: string;

  updatedAt: string;

}