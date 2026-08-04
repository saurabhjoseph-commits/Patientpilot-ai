/**
 * ============================================================
 * PatientPilot AI
 * Calendar Sync Validator
 * ============================================================
 */

import {
  CalendarSync,
  CalendarSyncStatus,
} from "./calendar-sync.types";

export interface ValidationResult {
  valid: boolean;

  errors: string[];
}

export function validateCalendarSync(
  sync: CalendarSync,
): ValidationResult {
  const errors: string[] = [];

  validateIdentity(sync, errors);

  validateConnection(sync, errors);

  validateRange(sync, errors);

  validateOptions(sync, errors);

  validateStatus(sync.status, sync, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateIdentity(
  sync: CalendarSync,
  errors: string[],
): void {
  if (!sync.id.trim()) {
    errors.push(
      "Calendar sync ID is required.",
    );
  }

  if (!sync.tenantId.trim()) {
    errors.push(
      "Tenant ID is required.",
    );
  }

  if (!sync.clinicId.trim()) {
    errors.push(
      "Clinic ID is required.",
    );
  }

  if (!sync.providerId.trim()) {
    errors.push(
      "Provider ID is required.",
    );
  }
}

function validateConnection(
  sync: CalendarSync,
  errors: string[],
): void {
  const connection =
    sync.connection;

  if (
    !connection.externalAccountId.trim()
  ) {
    errors.push(
      "External account ID is required.",
    );
  }

  if (
    !connection.externalCalendarId.trim()
  ) {
    errors.push(
      "External calendar ID is required.",
    );
  }
}

function validateRange(
  sync: CalendarSync,
  errors: string[],
): void {
  if (
    sync.range.startsAt >=
    sync.range.endsAt
  ) {
    errors.push(
      "Calendar sync range is invalid.",
    );
  }
}

function validateOptions(
  sync: CalendarSync,
  errors: string[],
): void {
  const options = sync.options;

  if (
    options.overwriteLocal &&
    options.overwriteRemote
  ) {
    errors.push(
      "Cannot overwrite both local and remote calendars simultaneously.",
    );
  }

  if (
    !options.syncAppointments &&
    !options.syncAvailability
  ) {
    errors.push(
      "At least one synchronization target must be enabled.",
    );
  }
}

function validateStatus(
  status: CalendarSyncStatus,
  sync: CalendarSync,
  errors: string[],
): void {
  switch (status) {
    case "pending":
      if (
        sync.startedAt ||
        sync.completedAt
      ) {
        errors.push(
          "Pending sync cannot have timestamps.",
        );
      }
      break;

    case "syncing":
      if (!sync.startedAt) {
        errors.push(
          "Syncing requires a start time.",
        );
      }

      if (sync.completedAt) {
        errors.push(
          "Syncing cannot have a completion time.",
        );
      }
      break;

    case "completed":
      if (!sync.startedAt) {
        errors.push(
          "Completed sync requires a start time.",
        );
      }

      if (!sync.completedAt) {
        errors.push(
          "Completed sync requires a completion time.",
        );
      }

      if (!sync.result) {
        errors.push(
          "Completed sync requires a result.",
        );
      }
      break;

    case "failed":
      if (!sync.startedAt) {
        errors.push(
          "Failed sync requires a start time.",
        );
      }
      break;

    default:
      assertNever(status);
  }
}

function assertNever(
  value: never,
): never {
  throw new Error(
    `Unhandled calendar sync status: ${value}`,
  );
}