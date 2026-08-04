// website/lib/core/tokens.ts

/**
 * ============================================================
 * PatientPilot AI
 * Core Service Tokens
 * ============================================================
 *
 * Tokens for platform-level services.
 */

import { createServiceToken } from "./container";

import type { AppConfig } from "./config";
import type { EventBus } from "./events";
import type { Logger } from "./logger";

export const CORE_TOKENS = {
  LOGGER: createServiceToken<Logger>(
    "core.logger"
  ),

  CONFIG: createServiceToken<AppConfig>(
    "core.config"
  ),

  ENVIRONMENT: createServiceToken<string>(
    "core.environment"
  ),

  EVENT_BUS: createServiceToken<EventBus>(
    "core.eventBus"
  ),
} as const;