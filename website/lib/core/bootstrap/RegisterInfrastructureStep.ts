// website/lib/core/bootstrap/RegisterInfrastructureStep.ts

import { logger } from "@/lib/core/logger";

import type { BootstrapStep } from "./BootstrapStep";
import type { StartupContext } from "./StartupContext";

/**
 * ============================================================
 * PatientPilot AI
 * Register Infrastructure Step
 * ============================================================
 *
 * Registers infrastructure services used across the
 * platform.
 *
 * Future registrations include:
 * - Database
 * - Cache
 * - Queue
 * - Storage
 * - Telemetry
 * - Metrics
 * - Feature Flags
 * - External Integrations
 */
export class RegisterInfrastructureStep
  implements BootstrapStep
{
  readonly name = "Register Infrastructure";

  execute(
    context: StartupContext,
  ): void {
    const { container } = context;

    logger.info(
      "Registering infrastructure services...",
    );

    // Future registrations:
    //
    // container.register(...)
    // container.register(...)
    // container.register(...)

    logger.info(
      `Infrastructure registration complete. Registered services: ${container.size()}`,
    );
  }
}