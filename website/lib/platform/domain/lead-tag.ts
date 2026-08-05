/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Associates reusable Tags with Leads.
 * A Lead may have many Tags, and a Tag
 * may be attached to many Leads.
 */

export interface LeadTagAppliedBy {

  userId?: string;

  aiAgentId?: string;

  system?: boolean;

}

export interface LeadTagMetadata {

  reason?: string;

  externalId?: string;

}

export interface LeadTag {

  id: string;

  tenantId: string;

  clinicId: string;

  leadId: string;

  tagId: string;

  appliedBy: LeadTagAppliedBy;

  metadata: LeadTagMetadata;

  createdAt: string;

}