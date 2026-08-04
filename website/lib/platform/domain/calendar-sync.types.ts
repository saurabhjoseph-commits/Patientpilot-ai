/**
 * ============================================================
 * PatientPilot AI
 * Calendar Sync Domain Types
 * ============================================================
 */

export type CalendarSyncStatus =
  | "pending"
  | "syncing"
  | "completed"
  | "failed";

export type CalendarSyncDirection =
  | "inbound"
  | "outbound"
  | "bidirectional";

export type CalendarProvider =
  | "google"
  | "microsoft"
  | "ical"
  | "open_dental"
  | "dentrix"
  | "eaglesoft"
  | "denticon"
  | "cliniko"
  | "generic";

export interface CalendarSyncRange {
  startsAt: Date;

  endsAt: Date;
}

export interface CalendarSyncStatistics {
  created: number;

  updated: number;

  deleted: number;

  skipped: number;

  conflicts: number;

  failed: number;
}

export interface CalendarSyncOptions {
  overwriteLocal: boolean;

  overwriteRemote: boolean;

  syncAppointments: boolean;

  syncAvailability: boolean;

  detectConflicts: boolean;
}

export interface CalendarSyncResult {
  statistics: CalendarSyncStatistics;

  completedAt: Date;
}

export interface CalendarConnection {
  provider: CalendarProvider;

  externalAccountId: string;

  externalCalendarId: string;

  connectedAt: Date;

  lastSuccessfulSyncAt?: Date;
}

export interface CalendarSync {
  id: string;

  tenantId: string;

  clinicId: string;

  providerId: string;

  status: CalendarSyncStatus;

  direction: CalendarSyncDirection;

  connection: CalendarConnection;

  range: CalendarSyncRange;

  options: CalendarSyncOptions;

  result?: CalendarSyncResult;

  startedAt?: Date;

  completedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}