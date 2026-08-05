/**
 * ============================================================
 * PatientPilot AI
 * Slot Generation Service
 * ============================================================
 */

import {
  SlotGeneration,
  SlotGenerationResult,
  SlotGenerationStatus,
} from "./slot-generation.types";

import {
  validateSlotGeneration,
  ValidationResult,
} from "./slot-generation-validator";

import {
  SlotGenerationPolicy,
  PolicyDecision,
} from "./slot-generation-policy";

export class SlotGenerationService {
  validate(
    generation: SlotGeneration,
  ): ValidationResult {
    return validateSlotGeneration(
      generation,
    );
  }

  canStart(
    generation: SlotGeneration,
  ): PolicyDecision {
    return SlotGenerationPolicy.canStart(
      generation,
    );
  }

  canComplete(
    generation: SlotGeneration,
  ): PolicyDecision {
    return SlotGenerationPolicy.canComplete(
      generation,
    );
  }

  canFail(
    generation: SlotGeneration,
  ): PolicyDecision {
    return SlotGenerationPolicy.canFail(
      generation,
    );
  }

  canRestart(
    generation: SlotGeneration,
  ): PolicyDecision {
    return SlotGenerationPolicy.canRestart(
      generation,
    );
  }

  canRegenerate(
    generation: SlotGeneration,
  ): PolicyDecision {
    return SlotGenerationPolicy.canRegenerate(
      generation,
    );
  }

  start(
    generation: SlotGeneration,
  ): SlotGeneration {
    return {
      ...generation,
      status: "running",
      startedAt: new Date(),
      completedAt: undefined,
      updatedAt: new Date(),
    };
  }

  complete(
    generation: SlotGeneration,
    result: SlotGenerationResult,
  ): SlotGeneration {
    return {
      ...generation,
      status: "completed",
      result,
      completedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  fail(
    generation: SlotGeneration,
  ): SlotGeneration {
    return {
      ...generation,
      status: "failed",
      completedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  restart(
    generation: SlotGeneration,
  ): SlotGeneration {
    return {
      ...generation,
      status: "pending",
      result: undefined,
      startedAt: undefined,
      completedAt: undefined,
      updatedAt: new Date(),
    };
  }

  regenerate(
    generation: SlotGeneration,
  ): SlotGeneration {
    return {
      ...generation,
      status: "pending",
      result: undefined,
      startedAt: undefined,
      completedAt: undefined,
      updatedAt: new Date(),
    };
  }

  updateStatus(
    generation: SlotGeneration,
    status: SlotGenerationStatus,
  ): SlotGeneration {
    return {
      ...generation,
      status,
      updatedAt: new Date(),
    };
  }

  shouldOverwriteExisting(
    generation: SlotGeneration,
  ): boolean {
    return SlotGenerationPolicy.shouldOverwriteExisting(
      generation,
    );
  }

  shouldIncludeExceptions(
    generation: SlotGeneration,
  ): boolean {
    return SlotGenerationPolicy.shouldIncludeExceptions(
      generation,
    );
  }

  shouldIncludeBreaks(
    generation: SlotGeneration,
  ): boolean {
    return SlotGenerationPolicy.shouldIncludeBreaks(
      generation,
    );
  }

  generateFutureOnly(
    generation: SlotGeneration,
  ): boolean {
    return SlotGenerationPolicy.generateFutureOnly(
      generation,
    );
  }

  isPending(
    generation: SlotGeneration,
  ): boolean {
    return SlotGenerationPolicy.isPending(
      generation,
    );
  }

  isRunning(
    generation: SlotGeneration,
  ): boolean {
    return SlotGenerationPolicy.isRunning(
      generation,
    );
  }

  isCompleted(
    generation: SlotGeneration,
  ): boolean {
    return SlotGenerationPolicy.isCompleted(
      generation,
    );
  }

  isFailed(
    generation: SlotGeneration,
  ): boolean {
    return SlotGenerationPolicy.isFailed(
      generation,
    );
  }
}

export const slotGenerationService =
  new SlotGenerationService();