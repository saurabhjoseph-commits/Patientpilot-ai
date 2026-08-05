/**
 * PP-002 Milestone A
 * Global Service Domain
 *
 * Represents a treatment or appointment type
 * offered by a clinic.
 */

export type ServiceStatus =
  | "active"
  | "inactive";

export type ServiceCategory =
  | "consultation"
  | "preventive"
  | "restorative"
  | "cosmetic"
  | "orthodontics"
  | "endodontics"
  | "periodontics"
  | "oral_surgery"
  | "implant"
  | "emergency"
  | "other";

export interface ServiceDuration {
  defaultMinutes: number;
  minimumMinutes?: number;
  maximumMinutes?: number;
}

export interface ServicePricing {
  currency: string;
  basePrice?: number;
  minimumPrice?: number;
  maximumPrice?: number;
  insuranceEligible: boolean;
}

export interface ServiceAvailability {
  onlineBooking: boolean;
  aiBooking: boolean;
  requiresApproval: boolean;
  emergencyEligible: boolean;
  availableProviderIds: string[];
}

export interface ServiceMetadata {
  code?: string;
  description?: string;
  preparationInstructions?: string;
  followUpInstructions?: string;
}

export interface Service {

  id: string;

  tenantId: string;

  clinicId: string;

  status: ServiceStatus;

  category: ServiceCategory;

  name: string;

  displayName: string;

  duration: ServiceDuration;

  pricing: ServicePricing;

  availability: ServiceAvailability;

  metadata: ServiceMetadata;

  tags: string[];

  createdAt: string;

  updatedAt: string;

}