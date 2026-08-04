// website/lib/platform/domain/index.ts

/**
 * PatientPilot AI
 * Platform Domain
 *
 * Public exports for the Follow-up domain.
 */

// Aggregate
export * from "./follow-up";

// Types
export * from "./follow-up.types";

// Business Rules
export * from "./follow-up-policy";
export * from "./follow-up-state";
export * from "./follow-up-validator";

// Domain Services
export * from "./follow-up-scheduler";
export * from "./follow-up-execution";