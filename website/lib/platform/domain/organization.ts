/**
 * PP-002 Milestone C
 * Global Organization Domain
 *
 * Represents an enterprise,
 * DSO, franchise network,
 * healthcare group, or
 * corporate organization.
 */

export type OrganizationStatus =
  | "prospect"
  | "active"
  | "inactive"
  | "suspended"
  | "archived";

export type OrganizationType =
  | "enterprise"
  | "dso"
  | "franchise"
  | "healthcare_system"
  | "hospital_group"
  | "partner"
  | "reseller"
  | "corporate"
  | "government"
  | "non_profit";

export interface OrganizationIdentity {

  legalName: string;

  displayName: string;

  registrationNumber?: string;

  taxId?: string;

}

export interface OrganizationContact {

  email?: string;

  phone?: string;

  website?: string;

}

export interface OrganizationAddress {

  addressLine1?: string;

  addressLine2?: string;

  city?: string;

  state?: string;

  postalCode?: string;

  countryCode?: string;

}

export interface OrganizationBranding {

  logoUrl?: string;

  primaryColor?: string;

  secondaryColor?: string;

}

export interface OrganizationMetadata {

  description?: string;

  tags: string[];

}

export interface Organization {

  id: string;

  code: string;

  status: OrganizationStatus;

  type: OrganizationType;

  identity: OrganizationIdentity;

  contact: OrganizationContact;

  address: OrganizationAddress;

  branding: OrganizationBranding;

  metadata: OrganizationMetadata;

  createdAt: string;

  updatedAt: string;

}