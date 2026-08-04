/**
 * ============================================================
 * PatientPilot AI
 * Infrastructure Bootstrap
 * ============================================================
 *
 * Composition root for the Infrastructure Layer.
 *
 * Responsible for:
 *
 * • Creating infrastructure services
 * • Registering repositories
 * • Registering infrastructure components
 * * Ensuring registration happens only once
 */

import { serviceRegistry } from "./ServiceRegistry";

import { SupabaseClientFactory } from "../persistence/supabase/SupabaseClientFactory";

import { ClinicRepository } from "../persistence/supabase/repositories/ClinicRepository";
import { UserRepository } from "../persistence/supabase/repositories/UserRepository";
import { RoleRepository } from "../persistence/supabase/repositories/RoleRepository";
import { RoleAssignmentRepository } from "../persistence/supabase/repositories/RoleAssignmentRepository";
import { UserCredentialRepository } from "../persistence/supabase/repositories/UserCredentialRepository";
import { UserSessionRepository } from "../persistence/supabase/repositories/UserSessionRepository";
import { ClinicSettingsRepository } from "../persistence/supabase/repositories/ClinicSettingsRepository";

import { UnitOfWork } from "../persistence/supabase/UnitOfWork";
import { EventPublisher } from "../events/EventPublisher";

let initialized = false;

/**
 * Initializes the infrastructure layer.
 *
 * Safe to call multiple times.
 */
export function bootstrapInfrastructure(): void {
  if (initialized) {
    return;
  }

  const db =
    SupabaseClientFactory.getServiceRoleClient();

  serviceRegistry.registerSingleton(
    "ClinicRepository",
    new ClinicRepository(db),
  );

  serviceRegistry.registerSingleton(
    "UserRepository",
    new UserRepository(db),
  );

  serviceRegistry.registerSingleton(
    "RoleRepository",
    new RoleRepository(db),
  );

  serviceRegistry.registerSingleton(
    "RoleAssignmentRepository",
    new RoleAssignmentRepository(db),
  );

  serviceRegistry.registerSingleton(
    "UserCredentialRepository",
    new UserCredentialRepository(db),
  );

  serviceRegistry.registerSingleton(
    "UserSessionRepository",
    new UserSessionRepository(db),
  );

  serviceRegistry.registerSingleton(
    "ClinicSettingsRepository",
    new ClinicSettingsRepository(db),
  );

  serviceRegistry.registerSingleton(
    "UnitOfWork",
    new UnitOfWork(),
  );

  serviceRegistry.registerSingleton(
    "EventPublisher",
    new EventPublisher(),
  );

  initialized = true;
}

/**
 * Returns whether the infrastructure has been initialized.
 */
export function isInfrastructureBootstrapped(): boolean {
  return initialized;
}
