/**
 * ============================================================
 * PatientPilot AI
 * Provider Availability Domain Types
 * ============================================================
 */

export type AvailabilityStatus =
  | "active"
  | "inactive";

export type AvailabilityType =
  | "working_hours"
  | "break"
  | "leave"
  | "holiday"
  | "training"
  | "blocked";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface AvailabilityTimeRange {
  startsAt: string;

  endsAt: string;
}

export interface ProviderAvailabilityRule {
  id: string;

  dayOfWeek: DayOfWeek;

  type: AvailabilityType;

  enabled: boolean;

  timeRange: AvailabilityTimeRange;
}

export interface ProviderAvailabilityException {
  id: string;

  date: string;

  type: AvailabilityType;

  reason?: string;

  timeRange?: AvailabilityTimeRange;
}

export interface ProviderAvailability {
  id: string;

  tenantId: string;

  clinicId: string;

  providerId: string;

  status: AvailabilityStatus;

  timezone: string;

  slotDurationMinutes: number;

  rules: ProviderAvailabilityRule[];

  exceptions: ProviderAvailabilityException[];

  createdAt: string;

  updatedAt: string;
}