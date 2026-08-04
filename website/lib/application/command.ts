/**
 * PatientPilot AI
 * Application Layer
 * Command
 *
 * Base application command contract.
 */

export interface Command {
  /**
   * Unique command identifier.
   */
  readonly id: string;

  /**
   * Command creation time.
   */
  readonly createdAt: Date;

  /**
   * Optional tenant identifier.
   */
  readonly tenantId?: string;

  /**
   * Optional correlation identifier.
   */
  readonly correlationId?: string;
}

export interface CommandHandler<
  TCommand extends Command,
  TResult,
> {
  execute(
    command: TCommand,
  ): Promise<TResult>;
}

/**
 * Creates a new base command.
 */
export function createCommand(
  overrides: Partial<Command> = {},
): Command {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    tenantId: overrides.tenantId,
    correlationId: overrides.correlationId,
  };
}

export default Command;