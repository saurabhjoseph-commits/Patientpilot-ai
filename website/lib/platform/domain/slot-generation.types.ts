/**
 * ============================================================
 * PatientPilot AI
 * Slot Generation Domain Types
 * ============================================================
 */

import {
  ProviderAvailability,
} from "./provider-availability.types";

import {
  AppointmentSlot,
} from "./appointment-slot.types";

export type SlotGenerationStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export type SlotGenerationMode =
  | "full"
  | "incremental"
  | "daily"
  | "weekly"
  | "manual";

export interface SlotGenerationRange {
  startsAt: Date;

  endsAt: Date;
}

export interface SlotGenerationStatistics {
  generatedSlots: number;

  skippedSlots: number;

  blockedSlots: number;

  existingSlots: number;
}

export interface SlotGenerationOptions {
  overwriteExisting: boolean;

  includeExceptions: boolean;

  includeBreaks: boolean;

  generateFutureOnly: boolean;
}

export interface SlotGenerationResult {
  slots: AppointmentSlot[];

  statistics: SlotGenerationStatistics;
}

export interface SlotGeneration {
  id: string;

  tenantId: string;

  clinicId: string;

  providerId: string;

  mode: SlotGenerationMode;

  status: SlotGenerationStatus;

  range: SlotGenerationRange;

  availability: ProviderAvailability;

  options: SlotGenerationOptions;

  result?: SlotGenerationResult;

  startedAt?: Date;

  completedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}