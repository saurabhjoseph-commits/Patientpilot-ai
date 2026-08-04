/**
 * PP-003 Operations Domain
 *
 * Represents a licensed healthcare provider.
 *
 * Scheduling, appointments, and encounters
 * are modeled separately.
 */

export type ProviderStatus =
  | "active"
  | "inactive"
  | "on_leave"
  | "retired";

export type ProviderType =
  | "dentist"
  | "hygienist"
  | "specialist"
  | "assistant"
  | "therapist"
  | "physician"
  | "nurse"
  | "other";

export interface ProviderIdentity {

  firstName: string;

  lastName: string;

  displayName?: string;

}

export interface ProviderProfessional {

  type: ProviderType;

  specialties: string[];

  licenseNumber?: string;

  licenseAuthority?: string;

  npi?: string;

}

export interface ProviderEmployment {

  employeeId?: string;

  department?: string;

  locationId?: string;

  hiredAt?: string;

}

export interface ProviderContact {

  email?: string;

  phone?: string;

}

export interface ProviderMetadata {

  notes?: string;

  externalId?: string;

}

export interface Provider {

  id: string;

  tenantId: string;

  clinicId: string;

  identity: ProviderIdentity;

  professional: ProviderProfessional;

  employment: ProviderEmployment;

  contact: ProviderContact;

  status: ProviderStatus;

  metadata: ProviderMetadata;

  createdAt: string;

  updatedAt: string;

}