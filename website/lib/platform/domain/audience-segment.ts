/**
 * PP-004 Communication & Engagement Domain
 *
 * Aggregate root representing
 * a reusable audience segment.
 *
 * Segments define reusable
 * recipient criteria that can
 * be used across campaigns,
 * workflows, analytics, and AI.
 */

export type AudienceSegmentCategory =
  | "patients"
  | "leads"
  | "customers"
  | "providers"
  | "staff"
  | "organizations"
  | "custom";

export type AudienceSegmentStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type AudienceSegmentOperator =
  | "and"
  | "or";

export interface AudienceSegmentRule {

  field: string;

  operator:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "greater_or_equal"
    | "less_than"
    | "less_or_equal"
    | "contains"
    | "starts_with"
    | "ends_with"
    | "in"
    | "not_in"
    | "between"
    | "exists"
    | "not_exists";

  value?: string | number | boolean | string[];

}

export interface AudienceSegmentCriteria {

  operator: AudienceSegmentOperator;

  rules: AudienceSegmentRule[];

}

export interface AudienceSegmentStatistics {

  estimatedMembers?: number;

  lastCalculatedAt?: string;

}

export interface AudienceSegmentMetadata {

  description?: string;

  externalId?: string;

}

export interface AudienceSegment {

  id: string;

  tenantId: string;

  clinicId: string;

  name: string;

  category: AudienceSegmentCategory;

  status: AudienceSegmentStatus;

  criteria: AudienceSegmentCriteria;

  statistics: AudienceSegmentStatistics;

  metadata: AudienceSegmentMetadata;

  createdAt: string;

  updatedAt: string;

}