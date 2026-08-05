// website/lib/platform/domain/follow-up-state.ts

import type { FollowUpStatus } from "./follow-up.types";

/**
 * PatientPilot AI
 * Follow-up State Machine
 *
 * Defines all valid follow-up state transitions.
 * Pure domain logic.
 */

export const TERMINAL_STATES: ReadonlySet<FollowUpStatus> = new Set([
  "completed",
  "failed",
  "cancelled",
  "expired",
]);

export const ACTIVE_STATES: ReadonlySet<FollowUpStatus> = new Set([
  "scheduled",
  "queued",
  "processing",
]);

const TRANSITIONS: Readonly<Record<FollowUpStatus, readonly FollowUpStatus[]>> =
  {
    draft: [
      "scheduled",
      "cancelled",
    ],

    scheduled: [
      "queued",
      "cancelled",
      "expired",
    ],

    queued: [
      "processing",
      "cancelled",
      "failed",
    ],

    processing: [
      "completed",
      "failed",
    ],

    completed: [],

    failed: [
      "queued",
      "cancelled",
    ],

    cancelled: [],

    expired: [],
  };

export class FollowUpStateMachine {
  canTransition(
    from: FollowUpStatus,
    to: FollowUpStatus,
  ): boolean {
    return TRANSITIONS[from].includes(to);
  }

  transition(
    from: FollowUpStatus,
    to: FollowUpStatus,
  ): FollowUpStatus {
    if (!this.canTransition(from, to)) {
      throw new Error(
        `Invalid follow-up state transition: ${from} -> ${to}`,
      );
    }

    return to;
  }

  isTerminal(
    status: FollowUpStatus,
  ): boolean {
    return TERMINAL_STATES.has(status);
  }

  isActive(
    status: FollowUpStatus,
  ): boolean {
    return ACTIVE_STATES.has(status);
  }

  canExecute(
    status: FollowUpStatus,
  ): boolean {
    return (
      status === "scheduled" ||
      status === "queued"
    );
  }

  canRetry(
    status: FollowUpStatus,
  ): boolean {
    return status === "failed";
  }

  canCancel(
    status: FollowUpStatus,
  ): boolean {
    return (
      status === "draft" ||
      status === "scheduled" ||
      status === "queued"
    );
  }

  nextAfterQueue(): FollowUpStatus {
    return "processing";
  }

  nextAfterSuccess(): FollowUpStatus {
    return "completed";
  }

  nextAfterFailure(): FollowUpStatus {
    return "failed";
  }

  nextAfterRetry(): FollowUpStatus {
    return "queued";
  }

  nextAfterCancellation(): FollowUpStatus {
    return "cancelled";
  }

  nextAfterExpiry(): FollowUpStatus {
    return "expired";
  }

  availableTransitions(
    status: FollowUpStatus,
  ): readonly FollowUpStatus[] {
    return TRANSITIONS[status];
  }
}

export const followUpState =
  new FollowUpStateMachine();