/**
 * ============================================================
 * PatientPilot AI
 * Slot Generation Aggregate
 * ============================================================
 */

import {
  SlotGeneration,
  SlotGenerationResult,
} from "./slot-generation.types";

import {
  slotGenerationService,
} from "./slot-generation-service";

export class SlotGenerationAggregate {
  constructor(
    private readonly generation: SlotGeneration,
  ) {}

  static create(
    generation: SlotGeneration,
  ): SlotGenerationAggregate {
    const validation =
      slotGenerationService.validate(
        generation,
      );

    if (!validation.valid) {
      throw new Error(
        validation.errors.join("\n"),
      );
    }

    return new SlotGenerationAggregate(
      generation,
    );
  }

  get value(): SlotGeneration {
    return this.generation;
  }

  start(): SlotGenerationAggregate {
    const decision =
      slotGenerationService.canStart(
        this.generation,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new SlotGenerationAggregate(
      slotGenerationService.start(
        this.generation,
      ),
    );
  }

  complete(
    result: SlotGenerationResult,
  ): SlotGenerationAggregate {
    const decision =
      slotGenerationService.canComplete(
        this.generation,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new SlotGenerationAggregate(
      slotGenerationService.complete(
        this.generation,
        result,
      ),
    );
  }

  fail(): SlotGenerationAggregate {
    const decision =
      slotGenerationService.canFail(
        this.generation,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new SlotGenerationAggregate(
      slotGenerationService.fail(
        this.generation,
      ),
    );
  }

  restart(): SlotGenerationAggregate {
    const decision =
      slotGenerationService.canRestart(
        this.generation,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new SlotGenerationAggregate(
      slotGenerationService.restart(
        this.generation,
      ),
    );
  }

  regenerate(): SlotGenerationAggregate {
    const decision =
      slotGenerationService.canRegenerate(
        this.generation,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new SlotGenerationAggregate(
      slotGenerationService.regenerate(
        this.generation,
      ),
    );
  }

  isPending(): boolean {
    return slotGenerationService.isPending(
      this.generation,
    );
  }

  isRunning(): boolean {
    return slotGenerationService.isRunning(
      this.generation,
    );
  }

  isCompleted(): boolean {
    return slotGenerationService.isCompleted(
      this.generation,
    );
  }

  isFailed(): boolean {
    return slotGenerationService.isFailed(
      this.generation,
    );
  }

  shouldOverwriteExisting(): boolean {
    return slotGenerationService.shouldOverwriteExisting(
      this.generation,
    );
  }

  shouldIncludeExceptions(): boolean {
    return slotGenerationService.shouldIncludeExceptions(
      this.generation,
    );
  }

  shouldIncludeBreaks(): boolean {
    return slotGenerationService.shouldIncludeBreaks(
      this.generation,
    );
  }

  generateFutureOnly(): boolean {
    return slotGenerationService.generateFutureOnly(
      this.generation,
    );
  }
}