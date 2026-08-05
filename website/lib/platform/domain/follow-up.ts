// website/lib/platform/domain/follow-up.ts

import { followUpPolicy } from "./follow-up-policy";
import { followUpState } from "./follow-up-state";
import { followUpValidator } from "./follow-up-validator";

import type {
  FollowUp,
  FollowUpSchedule,
} from "./follow-up.types";

/**
 * PatientPilot AI
 * Platform Domain
 * Follow-up Aggregate Root
 */

export class FollowUpAggregate {
  constructor(
    private readonly followUp: FollowUp,
  ) {
    followUpValidator.throwIfInvalid(
      this.followUp,
    );
  }

  get value(): FollowUp {
    return this.followUp;
  }

  validate(): void {
    followUpValidator.throwIfInvalid(
      this.followUp,
    );
  }

  schedule(
    schedule: FollowUpSchedule,
  ): void {
    this.followUp.schedule = schedule;

    followUpValidator.throwIfInvalid(
      this.followUp,
    );

    this.followUp.status =
      followUpState.transition(
        this.followUp.status,
        "scheduled",
      );

    this.touch();
  }

  reschedule(
    schedule: FollowUpSchedule,
  ): void {
    this.followUp.schedule = schedule;

    followUpValidator.throwIfInvalid(
      this.followUp,
    );

    this.touch();
  }

  queue(): void {
    this.followUp.status =
      followUpState.transition(
        this.followUp.status,
        "queued",
      );

    this.touch();
  }

  startProcessing(): void {
    this.followUp.status =
      followUpState.transition(
        this.followUp.status,
        "processing",
      );

    this.touch();
  }

  complete(): void {
    this.followUp.status =
      followUpState.transition(
        this.followUp.status,
        "completed",
      );

    this.touch();
  }

  fail(): void {
    this.followUp.status =
      followUpState.transition(
        this.followUp.status,
        "failed",
      );

    this.touch();
  }

  cancel(): void {
    this.followUp.status =
      followUpState.transition(
        this.followUp.status,
        "cancelled",
      );

    this.touch();
  }

  expire(): void {
    this.followUp.status =
      followUpState.transition(
        this.followUp.status,
        "expired",
      );

    this.touch();
  }

  canExecute(
    now: Date = new Date(),
  ): boolean {
    return (
      followUpState.canExecute(
        this.followUp.status,
      ) &&
      followUpPolicy.canSendNow(
        this.followUp,
        now,
      )
    );
  }

  private touch(): void {
    this.followUp.updatedAt =
      new Date();
  }
}

export function createFollowUpAggregate(
  followUp: FollowUp,
): FollowUpAggregate {
  return new FollowUpAggregate(
    followUp,
  );
}