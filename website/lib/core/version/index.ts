/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Platform Version Information
 * ============================================================
 */

export const VERSION = {
  PLATFORM: "1.0.0",

  API: "v1",

  SCHEMA: "1.0.0",

  AI_PROMPTS: "1.0.0",

  WORKFLOWS: "1.0.0",

  COMMUNICATION: "1.0.0",

  CRM: "1.0.0",

  DASHBOARD: "1.0.0",
} as const;

export const BUILD = {
  ENVIRONMENT: process.env.NODE_ENV ?? "development",

  BUILD_DATE: new Date().toISOString(),
} as const;

export const COMPATIBILITY = {
  MIN_SUPPORTED_API: "v1",

  CURRENT_API: VERSION.API,

  CURRENT_SCHEMA: VERSION.SCHEMA,
} as const;

/**
 * Returns a human-readable version string.
 */
export function getVersionString(): string {
  return `${VERSION.PLATFORM} (${VERSION.API})`;
}

/**
 * Returns complete runtime version information.
 */
export function getVersionInfo() {
  return {
    version: VERSION,
    build: BUILD,
    compatibility: COMPATIBILITY,
  };
}