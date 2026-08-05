/**
 * ============================================================
 * PatientPilot AI
 * Calendar Sync Service
 * ============================================================
 */

import {
  CalendarSync,
  CalendarSyncResult,
  CalendarSyncStatus,
} from "./calendar-sync.types";

import {
  validateCalendarSync,
  ValidationResult,
} from "./calendar-sync-validator";

import {
  CalendarSyncPolicy,
  PolicyDecision,
} from "./calendar-sync-policy";

export class CalendarSyncService {
  validate(
    sync: CalendarSync,
  ): ValidationResult {
    return validateCalendarSync(
      sync,
    );
  }

  canStart(
    sync: CalendarSync,
  ): PolicyDecision {
    return CalendarSyncPolicy.canStart(
      sync,
    );
  }

  canComplete(
    sync: CalendarSync,
  ): PolicyDecision {
    return CalendarSyncPolicy.canComplete(
      sync,
    );
  }

  canFail(
    sync: CalendarSync,
  ): PolicyDecision {
    return CalendarSyncPolicy.canFail(
      sync,
    );
  }

  canRestart(
    sync: CalendarSync,
  ): PolicyDecision {
    return CalendarSyncPolicy.canRestart(
      sync,
    );
  }

  start(
    sync: CalendarSync,
  ): CalendarSync {
    return {
      ...sync,
      status: "syncing",
      startedAt: new Date(),
      completedAt: undefined,
      updatedAt: new Date(),
    };
  }

  complete(
    sync: CalendarSync,
    result: CalendarSyncResult,
  ): CalendarSync {
    return {
      ...sync,
      status: "completed",
      result,
      completedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  fail(
    sync: CalendarSync,
  ): CalendarSync {
    return {
      ...sync,
      status: "failed",
      completedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  restart(
    sync: CalendarSync,
  ): CalendarSync {
    return {
      ...sync,
      status: "pending",
      result: undefined,
      startedAt: undefined,
      completedAt: undefined,
      updatedAt: new Date(),
    };
  }

  updateStatus(
    sync: CalendarSync,
    status: CalendarSyncStatus,
  ): CalendarSync {
    return {
      ...sync,
      status,
      updatedAt: new Date(),
    };
  }

  isPending(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.isPending(
      sync,
    );
  }

  isSyncing(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.isSyncing(
      sync,
    );
  }

  isCompleted(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.isCompleted(
      sync,
    );
  }

  isFailed(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.isFailed(
      sync,
    );
  }

  shouldOverwriteLocal(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.shouldOverwriteLocal(
      sync,
    );
  }

  shouldOverwriteRemote(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.shouldOverwriteRemote(
      sync,
    );
  }

  shouldSyncAppointments(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.shouldSyncAppointments(
      sync,
    );
  }

  shouldSyncAvailability(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.shouldSyncAvailability(
      sync,
    );
  }

  shouldDetectConflicts(
    sync: CalendarSync,
  ): boolean {
    return CalendarSyncPolicy.shouldDetectConflicts(
      sync,
    );
  }
}

export const calendarSyncService =
  new CalendarSyncService();