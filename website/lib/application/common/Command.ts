/**
 * ============================================================
 * PatientPilot AI
 * Command
 * ============================================================
 *
 * Marker interfaces and base contracts for commands.
 *
 * Commands represent requests that change application state.
 */

import type { ApplicationContext } from "./ApplicationContext";
import type { ApplicationResult } from "./ApplicationResult";
import type { UseCase } from "./UseCase";

/**
 * Marker interface for command requests.
 */
export interface Command {
  readonly type: string;
}

/**
 * Generic command handler.
 */
export interface CommandHandler<
  TCommand extends Command,
  TResult,
> extends UseCase<TCommand, TResult> {
  execute(
    context: ApplicationContext,
    command: TCommand,
  ): Promise<ApplicationResult<TResult>>;
}

/**
 * Base implementation for command handlers.
 */
export abstract class BaseCommandHandler<
  TCommand extends Command,
  TResult,
> implements CommandHandler<TCommand, TResult>
{
  abstract execute(
    context: ApplicationContext,
    command: TCommand,
  ): Promise<ApplicationResult<TResult>>;
}