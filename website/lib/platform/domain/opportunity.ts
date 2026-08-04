/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a sales opportunity created from a lead.
 * A single lead may have multiple opportunities.
 */

export type OpportunityStatus =
  | "open"
  | "won"
  | "lost"
  | "cancelled"
  | "on_hold";

export type OpportunityPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type OpportunitySource =
  | "website"
  | "phone"
  | "walk_in"
  | "campaign"
  | "referral"
  | "social_media"
  | "ai"
  | "manual"
  | "api"
  | "other";

export interface OpportunityValue {
  estimated: number;
  currency: string;
}

export interface OpportunityProbability {
  percentage: number; // 0–100
  confidence?: "low" | "medium" | "high";
}

export interface OpportunityAssignment {
  assignedUserId?: string;
  assignedTeamId?: string;
  assignedAt?: string;
}

export interface OpportunityMetadata {
  description?: string;
  notes?: string;
  tags: string[];
  aiConversationId?: string;
  externalId?: string;
}

export interface Opportunity {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  leadId: string;

  title: string;

  status: OpportunityStatus;

  priority: OpportunityPriority;

  source: OpportunitySource;

  estimatedValue: OpportunityValue;

  probability: OpportunityProbability;

  assignment: OpportunityAssignment;

  expectedCloseDate?: string;

  wonAt?: string;

  lostAt?: string;

  metadata: OpportunityMetadata;

  createdAt: string;

  updatedAt: string;

}