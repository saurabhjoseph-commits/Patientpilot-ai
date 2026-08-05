/**
 * PP-002 Milestone F
 * CRM & Sales Domain
 *
 * Represents a potential customer before
 * becoming an active patient.
 */

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "unqualified"
  | "converted"
  | "lost"
  | "archived";

export type LeadPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export interface LeadName {

  firstName: string;

  lastName: string;

  displayName: string;

}

export interface LeadContact {

  email?: string;

  phone?: string;

  preferredChannel?:
    | "phone"
    | "sms"
    | "email"
    | "whatsapp";

}

export interface LeadSource {

  source:
    | "website"
    | "phone"
    | "walk_in"
    | "campaign"
    | "referral"
    | "social_media"
    | "google"
    | "facebook"
    | "instagram"
    | "ai"
    | "manual"
    | "api"
    | "other";

  campaignId?: string;

  referralId?: string;

}

export interface LeadAssignment {

  assignedUserId?: string;

  assignedTeamId?: string;

  assignedAt?: string;

}

export interface LeadMetadata {

  notes?: string;

  tags: string[];

  aiConversationId?: string;

  externalId?: string;

}

export interface Lead {

  id: string;

  tenantId: string;

  clinicId: string;

  locationId?: string;

  name: LeadName;

  contact: LeadContact;

  status: LeadStatus;

  priority: LeadPriority;

  source: LeadSource;

  assignment: LeadAssignment;

  metadata: LeadMetadata;

  convertedPatientId?: string;

  createdAt: string;

  updatedAt: string;

}