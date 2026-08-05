/**
 * PP-002 Milestone C
 * Global Partner Domain
 *
 * Represents organizations that
 * participate in the commercial
 * ecosystem.
 */

export type PartnerStatus =
  | "prospect"
  | "active"
  | "inactive"
  | "suspended"
  | "terminated";

export type PartnerType =
  | "reseller"
  | "referral"
  | "affiliate"
  | "franchise"
  | "implementation"
  | "technology"
  | "consulting"
  | "marketplace"
  | "strategic";

export interface PartnerScope {

  tenantId?: string;

  countryCodes: string[];

  regionCodes: string[];

}

export interface PartnerContact {

  companyName: string;

  contactName?: string;

  email?: string;

  phone?: string;

  website?: string;

}

export interface PartnerCapabilities {

  supportsSales: boolean;

  supportsImplementation: boolean;

  supportsTraining: boolean;

  supportsSupport: boolean;

  supportsBilling: boolean;

}

export interface PartnerCommercial {

  salesChannelIds: string[];

  commissionPlanIds: string[];

  priceBookIds: string[];

  catalogIds: string[];

}

export interface PartnerMetadata {

  description?: string;

  notes?: string;

  tags: string[];

}

export interface Partner {

  id: string;

  code: string;

  name: string;

  status: PartnerStatus;

  type: PartnerType;

  scope: PartnerScope;

  contact: PartnerContact;

  capabilities: PartnerCapabilities;

  commercial: PartnerCommercial;

  metadata: PartnerMetadata;

  createdAt: string;

  updatedAt: string;

}