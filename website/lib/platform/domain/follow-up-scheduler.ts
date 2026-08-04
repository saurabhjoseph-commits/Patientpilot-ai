// website/lib/platform/domain/follow-up-scheduler.ts

import type {
  FollowUp,
  FollowUpRepository,
  FollowUpSchedule,
} from "./follow-up.types";

import { followUpPolicy } from "./follow-up-policy";
import { followUpState } from "./follow-up-state";
import { followUpValidator } from "./follow-up-validator";

/**
 * PatientPilot AI
 * Domain Scheduler
 *
 * Pure domain scheduling service.
 * No database implementation.
 * No cron.
 * No queue provider.
 * No Twilio/OpenAI/etc.
 *
 * Infrastructure will implement the repository.
 */

export interface DueFollowUpQuery {
  before: Date;
  limit?: number;
}

export interface FollowUpSchedulerService {
  schedule(
    followUp: FollowUp,
  ): Promise<FollowUp>;

  reschedule(
    followUp: FollowUp,
    schedule: FollowUpSchedule,
  ): Promise<FollowUp>;

  cancel(
    followUp: FollowUp,
  ): Promise<FollowUp>;

  due(
    query: DueFollowUpQuery,
  ): Promise<FollowUp[]>;
}

export class DomainFollowUpScheduler
  implements FollowUpSchedulerService
{
  constructor(
    private readonly repository: FollowUpRepository,
  ) {}

  async schedule(
    followUp: FollowUp,
  ): Promise<FollowUp> {
    followUpValidator.throwIfInvalid(
      followUp,
    );

    if (
      !followUpState.canTransition(
        followUp.status,
        "scheduled",
      )
    ) {
      throw new Error(
        `Cannot schedule follow-up from '${followUp.status}'.`,
      );
    }

    followUp.status = "scheduled";
    followUp.updatedAt = new Date();

    return this.repository.update(
      followUp,
    );
  }

  async reschedule(
    followUp: FollowUp,
    schedule: FollowUpSchedule,
  ): Promise<FollowUp> {
    if (
      followUpState.isTerminal(
        followUp.status,
      )
    ) {
      throw new Error(
        "Terminal follow-ups cannot be rescheduled.",
      );
    }

    followUp.schedule = schedule;
    followUp.updatedAt = new Date();

    followUpValidator.throwIfInvalid(
      followUp,
    );

    return this.repository.update(
      followUp,
    );
  }

  async cancel(
    followUp: FollowUp,
  ): Promise<FollowUp> {
    if (
      !followUpState.canCancel(
        followUp.status,
      )
    ) {
      throw new Error(
        `Cannot cancel follow-up in '${followUp.status}' state.`,
      );
    }

    followUp.status =
      followUpState.transition(
        followUp.status,
        "cancelled",
      );

    followUp.updatedAt = new Date();

    return this.repository.update(
      followUp,
    );
  }

  async due(
    query: DueFollowUpQuery,
  ): Promise<FollowUp[]> {
    const pending =
      await this.repository.findPending(
        query.before,
      );

    const eligible = pending.filter(
      (followUp) =>
        followUpPolicy.canSendNow(
          followUp,
          query.before,
        ),
    );

    if (
      query.limit &&
      query.limit > 0
    ) {
      return eligible.slice(
        0,
        query.limit,
      );
    }

    return eligible;
  }
}