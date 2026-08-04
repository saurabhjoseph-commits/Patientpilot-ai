// website/lib/platform/domain/follow-up-execution.ts

import { followUpPolicy } from "./follow-up-policy";
import { followUpState } from "./follow-up-state";

import type {
  FollowUp,
  FollowUpExecutionContext,
  FollowUpExecutionResult,
  FollowUpExecutor,
  FollowUpRepository,
} from "./follow-up.types";

/**
 * PatientPilot AI
 * Platform Domain
 * Follow-up Execution Service
 *
 * Pure domain orchestration.
 * No infrastructure or provider-specific logic.
 */

export interface FollowUpExecutionSummary {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
}

export class DomainFollowUpExecutionService {
  constructor(
    private readonly repository: FollowUpRepository,
    private readonly executor: FollowUpExecutor,
  ) {}

  async executeDue(
    before: Date = new Date(),
  ): Promise<FollowUpExecutionSummary> {
    const followUps =
      await this.repository.findPending(before);

    const summary: FollowUpExecutionSummary = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
    };

    for (const followUp of followUps) {
      if (!followUpPolicy.canSendNow(followUp, before)) {
        summary.skipped++;
        continue;
      }

      const result =
        await this.executeOne(followUp);

      summary.processed++;

      if (result.success) {
        summary.succeeded++;
      } else {
        summary.failed++;
      }
    }

    return summary;
  }

  async executeOne(
    followUp: FollowUp,
  ): Promise<FollowUpExecutionResult> {
    if (
      !followUpState.canExecute(
        followUp.status,
      )
    ) {
      return {
        success: false,
        completedAt: new Date(),
        status: "failed",
        errorCode: "INVALID_STATE",
        errorMessage:
          "Follow-up cannot be executed from its current state.",
      };
    }

    followUp.status =
      followUpState.transition(
        followUp.status,
        "processing",
      );

    followUp.updatedAt = new Date();

    await this.repository.update(
      followUp,
    );

    const context: FollowUpExecutionContext =
      {
        executionId:
          crypto.randomUUID(),
        attempt: 1,
        startedAt: new Date(),
      };

    try {
      const result =
        await this.executor.execute(
          followUp,
          context,
        );

      followUp.status =
        result.status;

      followUp.updatedAt =
        result.completedAt;

      await this.repository.update(
        followUp,
      );

      return result;
    } catch (error) {
      const result: FollowUpExecutionResult =
        {
          success: false,
          completedAt:
            new Date(),
          status: "failed",
          errorCode:
            "EXECUTION_ERROR",
          errorMessage:
            error instanceof Error
              ? error.message
              : "Unknown execution error.",
        };

      followUp.status =
        "failed";

      followUp.updatedAt =
        result.completedAt;

      await this.repository.update(
        followUp,
      );

      return result;
    }
  }
}