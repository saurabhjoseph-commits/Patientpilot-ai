// website/lib/core/bootstrap/BootstrapEngine.ts

import { logger } from "@/lib/core/logger";

import type { BootstrapResult } from "./BootstrapResult";
import type { BootstrapStep } from "./BootstrapStep";
import type { StartupContext } from "./StartupContext";

/**
 * ============================================================
 * PatientPilot AI
 * Bootstrap Engine
 * ============================================================
 *
 * Executes the bootstrap pipeline.
 */
export class BootstrapEngine {
  /**
   * Registered startup steps.
   */
  private readonly steps: BootstrapStep[] = [];

  /**
   * Registers a bootstrap step.
   */
  register(
    step: BootstrapStep,
  ): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Executes all registered steps.
   */
  async run(
    context: StartupContext,
  ): Promise<BootstrapResult> {
    const started = Date.now();

    const warnings: string[] = [];
    const modules: string[] = [];

    logger.info(
      "Starting PatientPilot AI bootstrap.",
    );

    for (const step of this.steps) {
      logger.info(
        `Running bootstrap step: ${step.name}`,
      );

      try {
        await step.execute(context);

        modules.push(step.name);
      } catch (error) {
        logger.error(
          `Bootstrap step failed: ${step.name}`,
          error instanceof Error
            ? error
            : undefined,
        );

        throw error;
      }
    }

    const durationMs =
      Date.now() - started;

    logger.info(
      `Bootstrap completed in ${durationMs} ms.`,
    );

    return {
      success: true,
      startedAt: context.startedAt,
      durationMs,
      version:
        context.config.app.VERSION,
      environment:
        context.environment.environment,
      modules,
      warnings,
    };
  }
}