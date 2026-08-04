// website/lib/core/bootstrap/tokens.ts

/**
 * ============================================================
 * PatientPilot AI
 * Bootstrap Service Tokens
 * ============================================================
 *
 * Tokens used during application startup.
 */

import { createServiceToken } from "@/lib/core/container";

import type { Logger } from "@/lib/core/logger";
import type { AppConfig, EnvironmentConfig } from "@/lib/core/config";
import type { EventBus } from "@/lib/core/events";

export const BOOTSTRAP_TOKENS = {
  LOGGER: createServiceToken<Logger>(
    "bootstrap.logger",
  ),

  CONFIG: createServiceToken<AppConfig>(
    "bootstrap.config",
  ),

  ENVIRONMENT:
    createServiceToken<EnvironmentConfig>(
      "bootstrap.environment",
    ),

  EVENT_BUS: createServiceToken<EventBus>(
    "bootstrap.eventBus",
  ),
} as const;