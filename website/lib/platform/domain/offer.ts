/**
 * PP-002 Milestone C
 * Global Offer Domain
 *
 * Represents commercial offers that package
 * catalogs, products and pricing into
 * time-bound sales propositions.
 */

export type OfferStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "expired"
  | "archived";

export type OfferType =
  | "standard"
  | "promotion"
  | "trial"
  | "partner"
  | "seasonal"
  | "campaign"
  | "enterprise";

export interface OfferScope {

  tenantId?: string;

  countryCodes: string[];

  customerSegments: string[];

  salesChannels: string[];

}

export interface OfferContent {

  catalogIds: string[];

  productIds: string[];

  productBundleIds: string[];

  priceBookIds: string[];

  couponIds: string[];

}

export interface OfferRules {

  stackable: boolean;

  priority: number;

  requiresApproval: boolean;

  maxRedemptions?: number;

}

export interface OfferValidity {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface OfferMetadata {

  description?: string;

  campaignCode?: string;

  createdBy?: string;

  tags: string[];

}

export interface Offer {

  id: string;

  code: string;

  name: string;

  status: OfferStatus;

  type: OfferType;

  scope: OfferScope;

  content: OfferContent;

  rules: OfferRules;

  validity: OfferValidity;

  metadata: OfferMetadata;

  createdAt: string;

  updatedAt: string;

}