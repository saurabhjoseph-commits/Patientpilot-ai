/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Dependency Injection Container
 * Public API
 * ============================================================
 */

// Container
export {
  Container,
  container,
} from "./container";

// Service Tokens
export {
  ServiceToken,
  createServiceToken,
} from "./ServiceToken";

// Service Providers
export {
  ServiceLifetime,
  createServiceProvider,
} from "./ServiceProvider";

export type {
  ServiceFactory,
  ServiceProvider,
  ServiceResolver,
} from "./ServiceProvider";