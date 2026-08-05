/**
 * ============================================================
 * PatientPilot AI
 * Calendar Sync Policy
 * ============================================================
 */

import {
  CalendarSync,
} from "./calendar-sync.types";

export interface PolicyDecision {
  allowed: boolean;

  reason?: string;
}

export class CalendarSyncPolicy {
  static canStart(
    sync: CalendarSync,
  ): PolicyDecision {
    if (sync.status !== "pending") {
      return {
        allowed: false,
        reason:
          "Only pending synchronizations can start.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canComplete(
    sync: CalendarSync,
  ): PolicyDecision {
    if (sync.status !== "syncing") {
      return {
        allowed: false,
        reason:
          "Only syncing operations can complete.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canFail(
    sync: CalendarSync,
  ): PolicyDecision {
    if (sync.status !== "syncing") {
      return {
        allowed: false,
        reason:
          "Only syncing operations can fail.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canRestart(
    sync: CalendarSync,
  ): PolicyDecision {
    switch (sync.status) {
      case "completed":
      case "failed":
        return {
          allowed: true,
        };

      default:
        return {
          allowed: false,
          reason:
            "Only completed or failed synchronizations can restart.",
        };
    }
  }

  static shouldOverwriteLocal(
    sync: CalendarSync,
  ): boolean {
    return sync.options.overwriteLocal;
  }

  static shouldOverwriteRemote(
    sync: CalendarSync,
  ): boolean {
    return sync.options.overwriteRemote;
  }

  static shouldSyncAppointments(
    sync: CalendarSync,
  ): boolean {
    return sync.options.syncAppointments;
  }

  static shouldSyncAvailability(
    sync: CalendarSync,
  ): boolean {
    return sync.options.syncAvailability;
  }

  static shouldDetectConflicts(
    sync: CalendarSync,
  ): boolean {
    return sync.options.detectConflicts;
  }

  static isPending(
    sync: CalendarSync,
  ): boolean {
    return sync.status === "pending";
  }

  static isSyncing(
    sync: CalendarSync,
  ): boolean {
    return sync.status === "syncing";
  }

  static isCompleted(
    sync: CalendarSync,
  ): boolean {
    return sync.status === "completed";
  }

  static isFailed(
    sync: CalendarSync,
  ): boolean {
    return sync.status === "failed";
  }
}