// website/lib/core/bootstrap/ValidateConfigurationStep.ts

import { logger } from "@/lib/core/logger";
import { validateConfig } from "@/lib/core/config";

import type { BootstrapStep } from "./BootstrapStep";
import type { StartupContext } from "./StartupContext";

/**
 * ============================================================
 * PatientPilot AI
 * Validate Configuration Step
 * ============================================================
 *
 * Validates the application configuration before any
 * services are registered.
 */
export class ValidateConfigurationStep
  implements BootstrapStep
{
  readonly name = "Validate Configuration";

  execute(
    context: StartupContext,
  ): void {
    logger.info(
      "Validating application configuration...",
    );

    validateConfig(context.config);

    logger.info(
      "Application configuration validated.",
    );
  }
}