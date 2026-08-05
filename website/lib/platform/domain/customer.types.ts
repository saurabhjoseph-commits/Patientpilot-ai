/**
 * ============================================================
 * PatientPilot AI
 * Customer Domain Types
 * ============================================================
 */

export type CustomerStatus =
  | "active"
  | "inactive"
  | "prospect"
  | "archived";

export type CustomerRiskLevel =
  | "low"
  | "medium"
  | "high";

export type CustomerLoyaltyTier =
  | "none"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum";

export interface CustomerMetrics {
  lifetimeValue: number;

  totalAppointments: number;

  completedAppointments: number;

  cancelledAppointments: number;

  noShowAppointments: number;

  totalTreatments: number;

  averageVisitValue: number;
}

export interface CustomerPreferences {
  preferredClinicId?: string;

  preferredDentistId?: string;

  preferredLanguage?: string;

  preferredTimezone?: string;
}

export interface CustomerRecall {
  lastVisitAt?: Date;

  nextRecallAt?: Date;

  recallIntervalMonths: number;

  overdue: boolean;
}

export interface CustomerInsurance {
  provider?: string;

  policyNumber?: string;

  memberId?: string;

  verified: boolean;

  expiresAt?: Date;
}

export interface CustomerFlags {
  vip: boolean;

  requiresManualApproval: boolean;

  collectionsHold: boolean;

  doNotSchedule: boolean;
}

export interface Customer {
  id: string;

  tenantId: string;

  leadId?: string;

  contactId?: string;

  externalId?: string;

  status: CustomerStatus;

  riskLevel: CustomerRiskLevel;

  loyaltyTier: CustomerLoyaltyTier;

  metrics: CustomerMetrics;

  preferences: CustomerPreferences;

  recall: CustomerRecall;

  insurance?: CustomerInsurance;

  flags: CustomerFlags;

  tags: string[];

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}