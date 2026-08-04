/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Application Constants
 * ============================================================
 */

export const APP = {
  NAME: "PatientPilot AI",
  SHORT_NAME: "PatientPilot",
  DESCRIPTION: "Global AI Front Office Manager for Dental Clinics",

  VERSION: "1.0.0",

  API_VERSION: "v1",

  ORGANIZATION: "PatientPilot AI",

  DEFAULT_LOCALE: "en-US",

  DEFAULT_TIMEZONE: "UTC",

  DEFAULT_COUNTRY: "US",

  SUPPORT_EMAIL: "support@patientpilot.ai",

  WEBSITE: "https://patientpilot.ai",
} as const;

export const PLATFORM = {
  MULTI_TENANT: true,

  GLOBAL_READY: true,

  AI_PROVIDER: "OpenAI",

  DEFAULT_MODEL: "gpt-5.5",

  MAX_CONVERSATION_HISTORY: 100,

  MAX_MESSAGE_LENGTH: 10000,
} as const;

export const API = {
  PREFIX: "/api",

  TIMEOUT_MS: 30000,

  DEFAULT_PAGE_SIZE: 20,

  MAX_PAGE_SIZE: 100,
} as const;

export const SECURITY = {
  PASSWORD_MIN_LENGTH: 8,

  SESSION_TIMEOUT_MINUTES: 60,

  MAX_LOGIN_ATTEMPTS: 5,
} as const;