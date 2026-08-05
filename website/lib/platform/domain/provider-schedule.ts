/**
 * PP-003 Operations Domain
 *
 * Represents provider availability.
 *
 * Appointments consume schedule capacity but
 * are not stored within the schedule.
 */

export type ProviderScheduleStatus =
  | "active"
  | "inactive";

export type ProviderScheduleType =
  | "regular"
  | "exception"
  | "holiday"
  | "blocked"
  | "on_call";

export interface ProviderScheduleProvider {

  providerId: string;

}

export interface ProviderScheduleEffectivePeriod {

  effectiveFrom: string;

  effectiveTo?: string;

}

export interface ProviderWorkingInterval {

  dayOfWeek:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

  startTime: string;

  endTime: string;

}

export interface ProviderBreakInterval {

  startTime: string;

  endTime: string;

  reason?: string;

}

export interface ProviderScheduleLocation {

  locationId?: string;

  timezone: string;

}

export interface ProviderScheduleMetadata {

  notes?: string;

  externalId?: string;

}

export interface ProviderSchedule {

  id: string;

  tenantId: string;

  clinicId: string;

  provider: ProviderScheduleProvider;

  type: ProviderScheduleType;

  status: ProviderScheduleStatus;

  effectivePeriod: ProviderScheduleEffectivePeriod;

  workingHours: ProviderWorkingInterval[];

  breaks: ProviderBreakInterval[];

  location: ProviderScheduleLocation;

  metadata: ProviderScheduleMetadata;

  createdAt: string;

  updatedAt: string;

}