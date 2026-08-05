/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a commercial agreement created from
 * a successful Opportunity.
 *
 * A Deal becomes the foundation for Quotes,
 * Estimates, Products, Billing and Service Delivery.
 */

export type DealStatus =
  | "draft"
  | "active"
  | "completed"
  | "cancelled"
  | "expired";

export type DealType =
  | "treatment"
  | "membership"
  | "subscription"
  | "product"
  | "service"
  | "custom";

export interface DealValue {

  currencyCode: string;

  subtotal: number;

  discount: number;

  tax: number;

  total: number;

}

export interface DealAssignment {

  ownerUserId?: string;

  teamId?: string;

}

export interface DealDates {

  openedAt: string;

  expectedCloseAt?: string;

  closedAt?: string;

  expiresAt?: string;

}

export interface DealMetadata {

  description?: string;

  externalId?: string;

  archived: boolean;

}

export interface Deal {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  opportunityId: string;

  leadId?: string;

  patientId?: string;

  customerId?: string;

  pipelineId: string;

  stageId: string;

  name: string;

  type: DealType;

  status: DealStatus;

  value: DealValue;

  assignment: DealAssignment;

  dates: DealDates;

  metadata: DealMetadata;

  createdAt: string;

  updatedAt: string;

}