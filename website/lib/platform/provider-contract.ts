/**
 * PP-002 Milestone A
 * Platform Provider Contract
 *
 * Defines the canonical contract for clinical providers
 * used by platform modules, scheduling services,
 * AI orchestration, and external PMS integrations.
 *
 * This is NOT the business domain entity.
 * The business Provider entity lives under:
 *   /platform/domain/provider.ts
 */

export type ProviderContractStatus =
  | "active"
  | "inactive"
  | "on_leave";

export type ProviderContractRole =
  | "dentist"
  | "orthodontist"
  | "oral_surgeon"
  | "periodontist"
  | "endodontist"
  | "prosthodontist"
  | "pediatric_dentist"
  | "hygienist"
  | "assistant"
  | "other";

export interface ProviderContractName {
  firstName: string;
  lastName: string;
  title?: string;
  displayName: string;
}

export interface ProviderContractContact {
  email: string;
  phone?: string;
}

export interface ProviderContractAvailability {
  acceptsNewPatients: boolean;
  appointmentDuration: number; // minutes
  workingDays: (
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  )[];
}

export interface ProviderContractProfessionalInfo {
  licenseNumber?: string;
  specialties: string[];
  languages: string[];
  biography?: string;
}

export interface ProviderContract {
  id: string;

  tenantId: string;

  clinicId: string;

  locationId: string;

  status: ProviderContractStatus;

  role: ProviderContractRole;

  name: ProviderContractName;

  contact: ProviderContractContact;

  professional: ProviderContractProfessionalInfo;

  availability: ProviderContractAvailability;

  createdAt: string;

  updatedAt: string;
}