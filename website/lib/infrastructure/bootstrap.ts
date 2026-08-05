/**
 * PatientPilot AI
 * Infrastructure Layer
 * Bootstrap
 *
 * Initializes infrastructure providers and registers
 * shared services.
 */

import configuration from "./config";

import {
  infrastructureContainer,
} from "./container";

import {
  providerRegistry,
  Provider,
} from "./providers";

import {
  supabaseDatabaseProvider,
} from "./providers/supabase/database-provider";

export interface BootstrapResult {
  readonly initialized: boolean;
  readonly providers: readonly Provider[];
}

export class InfrastructureBootstrap {
  initialize(): BootstrapResult {
    if (!providerRegistry.resolve("supabase")) {
      providerRegistry.register({
        id: "supabase",
        name: "Supabase",
        enabled: true,
      });
    }

    if (!infrastructureContainer.has("config")) {
      infrastructureContainer.register(
        "config",
        () => configuration,
      );
    }

    if (!infrastructureContainer.has("database")) {
      infrastructureContainer.register(
        "database",
        () => supabaseDatabaseProvider,
      );
    }

    return {
      initialized: true,
      providers: providerRegistry.list(),
    };
  }
}

/**
 * Shared bootstrap instance.
 */
export const infrastructureBootstrap =
  new InfrastructureBootstrap();

export default infrastructureBootstrap;