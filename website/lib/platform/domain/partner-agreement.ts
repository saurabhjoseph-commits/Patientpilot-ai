/**
 * PP-002 Milestone C
 * Global Partner Agreement Domain
 *
 * Defines the commercial and legal
 * agreement between the platform
 * and a partner organization.
 */

export type PartnerAgreementStatus =
  | "draft"
  | "pending"
  | "active"
  | "expired"
  | "terminated"
  | "cancelled";

export type PartnerAgreementType =
  | "reseller"
  | "referral"
  | "affiliate"
  | "franchise"
  | "implementation"
  | "technology"
  | "strategic";

export type RenewalType =
  | "none"
  | "automatic"
  | "manual";

export interface PartnerAgreementScope {

  tenantId?: string;

  countryCodes: string[];

  regionCodes: string[];

}

export interface PartnerAgreementCommercial {

  commissionPlanIds: string[];

  salesChannelIds: string[];

  catalogIds: string[];

  priceBookIds: string[];

}

export interface PartnerAgreementTerm {

  effectiveFrom: string;

  effectiveTo?: string;

  renewalType: RenewalType;

  noticePeriodDays?: number;

}

export interface PartnerAgreementMetadata {

  signedByPartner?: string;

  signedByPlatform?: string;

  externalReference?: string;

  notes?: string;

  tags: string[];

}

export interface PartnerAgreement {

  id: string;

  partnerId: string;

  code: string;

  name: string;

  status: PartnerAgreementStatus;

  type: PartnerAgreementType;

  scope: PartnerAgreementScope;

  commercial: PartnerAgreementCommercial;

  term: PartnerAgreementTerm;

  metadata: PartnerAgreementMetadata;

  createdAt: string;

  updatedAt: string;

}