/**
 * ============================================================
 * PatientPilot AI
 * Calendar Sync Aggregate
 * ============================================================
 */

import {
  CalendarSync,
  CalendarSyncResult,
} from "./calendar-sync.types";

import {
  calendarSyncService,
} from "./calendar-sync-service";

export class CalendarSyncAggregate {
  constructor(
    private readonly sync: CalendarSync,
  ) {}

  static create(
    sync: CalendarSync,
  ): CalendarSyncAggregate {
    const validation =
      calendarSyncService.validate(
        sync,
      );

    if (!validation.valid) {
      throw new Error(
        validation.errors.join("\n"),
      );
    }

    return new CalendarSyncAggregate(
      sync,
    );
  }

  get value(): CalendarSync {
    return this.sync;
  }

  start(): CalendarSyncAggregate {
    const decision =
      calendarSyncService.canStart(
        this.sync,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new CalendarSyncAggregate(
      calendarSyncService.start(
        this.sync,
      ),
    );
  }

  complete(
    result: CalendarSyncResult,
  ): CalendarSyncAggregate {
    const decision =
      calendarSyncService.canComplete(
        this.sync,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new CalendarSyncAggregate(
      calendarSyncService.complete(
        this.sync,
        result,
      ),
    );
  }

  fail(): CalendarSyncAggregate {
    const decision =
      calendarSyncService.canFail(
        this.sync,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new CalendarSyncAggregate(
      calendarSyncService.fail(
        this.sync,
      ),
    );
  }

  restart(): CalendarSyncAggregate {
    const decision =
      calendarSyncService.canRestart(
        this.sync,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new CalendarSyncAggregate(
      calendarSyncService.restart(
        this.sync,
      ),
    );
  }

  isPending(): boolean {
    return calendarSyncService.isPending(
      this.sync,
    );
  }

  isSyncing(): boolean {
    return calendarSyncService.isSyncing(
      this.sync,
    );
  }

  isCompleted(): boolean {
    return calendarSyncService.isCompleted(
      this.sync,
    );
  }

  isFailed(): boolean {
    return calendarSyncService.isFailed(
      this.sync,
    );
  }

  shouldOverwriteLocal(): boolean {
    return calendarSyncService.shouldOverwriteLocal(
      this.sync,
    );
  }

  shouldOverwriteRemote(): boolean {
    return calendarSyncService.shouldOverwriteRemote(
      this.sync,
    );
  }

  shouldSyncAppointments(): boolean {
    return calendarSyncService.shouldSyncAppointments(
      this.sync,
    );
  }

  shouldSyncAvailability(): boolean {
    return calendarSyncService.shouldSyncAvailability(
      this.sync,
    );
  }

  shouldDetectConflicts(): boolean {
    return calendarSyncService.shouldDetectConflicts(
      this.sync,
    );
  }
}