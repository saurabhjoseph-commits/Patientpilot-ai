/**
 * ============================================================
 * PatientPilot AI
 * Slot Generation Policy
 * ============================================================
 */

import {
  SlotGeneration,
} from "./slot-generation.types";

export interface PolicyDecision {
  allowed: boolean;

  reason?: string;
}

export class SlotGenerationPolicy {
  static canStart(
    generation: SlotGeneration,
  ): PolicyDecision {
    if (generation.status !== "pending") {
      return {
        allowed: false,
        reason:
          "Only pending generation jobs can start.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canComplete(
    generation: SlotGeneration,
  ): PolicyDecision {
    if (generation.status !== "running") {
      return {
        allowed: false,
        reason:
          "Only running generation jobs can complete.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canFail(
    generation: SlotGeneration,
  ): PolicyDecision {
    if (generation.status !== "running") {
      return {
        allowed: false,
        reason:
          "Only running generation jobs can fail.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canRestart(
    generation: SlotGeneration,
  ): PolicyDecision {
    switch (generation.status) {
      case "failed":
      case "completed":
        return {
          allowed: true,
        };

      default:
        return {
          allowed: false,
          reason:
            "Only completed or failed jobs can be restarted.",
        };
    }
  }

  static canRegenerate(
    generation: SlotGeneration,
  ): PolicyDecision {
    if (
      generation.status !==
      "completed"
    ) {
      return {
        allowed: false,
        reason:
          "Only completed jobs can regenerate slots.",
      };
    }

    return {
      allowed: true,
    };
  }

  static shouldOverwriteExisting(
    generation: SlotGeneration,
  ): boolean {
    return generation.options.overwriteExisting;
  }

  static shouldIncludeExceptions(
    generation: SlotGeneration,
  ): boolean {
    return generation.options.includeExceptions;
  }

  static shouldIncludeBreaks(
    generation: SlotGeneration,
  ): boolean {
    return generation.options.includeBreaks;
  }

  static generateFutureOnly(
    generation: SlotGeneration,
  ): boolean {
    return generation.options.generateFutureOnly;
  }

  static isRunning(
    generation: SlotGeneration,
  ): boolean {
    return (
      generation.status ===
      "running"
    );
  }

  static isCompleted(
    generation: SlotGeneration,
  ): boolean {
    return (
      generation.status ===
      "completed"
    );
  }

  static isFailed(
    generation: SlotGeneration,
  ): boolean {
    return (
      generation.status ===
      "failed"
    );
  }

  static isPending(
    generation: SlotGeneration,
  ): boolean {
    return (
      generation.status ===
      "pending"
    );
  }
}