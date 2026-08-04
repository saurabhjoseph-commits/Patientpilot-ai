// website/lib/core/bootstrap/bootstrap.ts

import {
  container,
} from "@/lib/core/container";

import {
  config,
  environment,
} from "@/lib/core/config";

import {
  BootstrapEngine,
} from "./BootstrapEngine";

import {
  RegisterCoreServicesStep,
} from "./RegisterCoreServicesStep";

import {
  RegisterInfrastructureStep,
} from "./RegisterInfrastructureStep";

import {
  ValidateConfigurationStep,
} from "./ValidateConfigurationStep";

import type {
  BootstrapResult,
} from "./BootstrapResult";

import type {
  StartupContext,
} from "./StartupContext";

/**
 * ============================================================
 * PatientPilot AI
 * Bootstrap Entry Point
 * ============================================================
 *
 * Creates the startup context and executes
 * the application bootstrap pipeline.
 */
export async function bootstrap(): Promise<BootstrapResult> {
  const context: StartupContext = {
    container,
    config,
    startedAt: new Date(),
    environment,
  };

  const pipeline =
    new BootstrapEngine()
      .register(
        new ValidateConfigurationStep(),
      )
      .register(
        new RegisterCoreServicesStep(),
      )
      .register(
        new RegisterInfrastructureStep(),
      );

  return pipeline.run(context);
}