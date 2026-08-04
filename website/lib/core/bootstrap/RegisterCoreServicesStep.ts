// website/lib/core/bootstrap/RegisterCoreServicesStep.ts

import { logger } from "@/lib/core/logger";
import {
  config,
  environment,
} from "@/lib/core/config";
import { eventBus } from "@/lib/core/events";

import {
  createServiceProvider,
  ServiceLifetime,
} from "@/lib/core/container";

import { BOOTSTRAP_TOKENS } from "./tokens";
import type { BootstrapStep } from "./BootstrapStep";
import type { StartupContext } from "./StartupContext";

/**
 * ============================================================
 * PatientPilot AI
 * Register Core Services Step
 * ============================================================
 *
 * Registers all platform-level singleton services.
 */

export class RegisterCoreServicesStep
  implements BootstrapStep
{
  readonly name =
    "Register Core Services";

  execute(
    context: StartupContext,
  ): void {
    const { container } = context;

    container.register(
      createServiceProvider(
        BOOTSTRAP_TOKENS.LOGGER,
        () => logger,
        ServiceLifetime.Singleton,
      ),
    );

    container.register(
      createServiceProvider(
        BOOTSTRAP_TOKENS.CONFIG,
        () => config,
        ServiceLifetime.Singleton,
      ),
    );

    container.register(
      createServiceProvider(
        BOOTSTRAP_TOKENS.ENVIRONMENT,
        () => environment,
        ServiceLifetime.Singleton,
      ),
    );

    container.register(
      createServiceProvider(
        BOOTSTRAP_TOKENS.EVENT_BUS,
        () => eventBus,
        ServiceLifetime.Singleton,
      ),
    );
  }
}