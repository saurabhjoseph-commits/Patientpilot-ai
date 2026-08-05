/**
 * PP-004 Event Domain
 *
 * Aggregate root representing
 * a canonical business event
 * published by the platform.
 *
 * Business events are consumed
 * by workflows, AI, integrations,
 * analytics and audit services.
 */

export type BusinessEventCategory =
  | "patient"
  | "appointment"
  | "lead"
  | "customer"
  | "conversation"
  | "billing"
  | "payment"
  | "clinical"
  | "communication"
  | "campaign"
  | "workflow"
  | "integration"
  | "system"
  | "custom";

export type BusinessEventStatus =
  | "active"
  | "inactive"
  | "deprecated";

export type BusinessEventVisibility =
  | "internal"
  | "public";

export interface BusinessEventPayload {

  schemaVersion: number;

  entityType: string;

  requiredFields: string[];

}

export interface BusinessEventMetadata {

  description?: string;

  displayName?: string;

  externalId?: string;

}

export interface BusinessEvent {

  id: string;

  tenantId: string;

  category: BusinessEventCategory;

  name: string;

  eventKey: string;

  status: BusinessEventStatus;

  visibility: BusinessEventVisibility;

  payload: BusinessEventPayload;

  metadata: BusinessEventMetadata;

  createdAt: string;

  updatedAt: string;

}