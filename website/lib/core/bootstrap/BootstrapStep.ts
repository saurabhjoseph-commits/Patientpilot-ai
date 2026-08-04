// website/lib/core/bootstrap/BootstrapStep.ts

import type { StartupContext } from "./StartupContext";

/**
 * A single bootstrap pipeline step.
 */
export interface BootstrapStep {
  /**
   * Friendly step name.
   */
  readonly name: string;

  /**
   * Executes the startup step.
   *
   * Steps may be synchronous or asynchronous.
   */
  execute(
    context: StartupContext,
  ): void | Promise<void>;
}