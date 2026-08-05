/**
 * PatientPilot AI
 * Platform Runtime - Expression Engine Contract
 *
 * Defines the public API for evaluating platform expressions.
 * Implementations are provided by the runtime layer.
 */

export type Expression = string;
export type ExpressionId = string;

export type ExpressionValue =
  | string
  | number
  | boolean
  | null
  | Date
  | ExpressionValue[]
  | { readonly [key: string]: ExpressionValue };

export interface ExpressionContext {
  /**
   * Variables available during evaluation.
   */
  readonly variables: Readonly<Record<string, ExpressionValue>>;

  /**
   * Optional execution metadata.
   */
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface ExpressionDiagnostics {
  /**
   * Indicates whether evaluation succeeded.
   */
  readonly success: boolean;

  /**
   * Optional diagnostic messages.
   */
  readonly messages: readonly string[];

  /**
   * Execution duration in milliseconds.
   */
  readonly durationMs: number;
}

export interface ExpressionResult<T = ExpressionValue> {
  /**
   * Evaluated value.
   */
  readonly value: T;

  /**
   * Diagnostic information.
   */
  readonly diagnostics: ExpressionDiagnostics;
}

export interface CompiledExpression {
  /**
   * Unique identifier.
   */
  readonly id: ExpressionId;

  /**
   * Original expression.
   */
  readonly source: Expression;

  /**
   * Creation timestamp.
   */
  readonly compiledAt: Date;
}

export interface ExpressionEngine {
  /**
   * Compiles an expression for repeated execution.
   */
  compile(
    expression: Expression,
  ): CompiledExpression;

  /**
   * Evaluates an expression.
   */
  evaluate<T = ExpressionValue>(
    expression: Expression,
    context?: ExpressionContext,
  ): ExpressionResult<T>;

  /**
   * Evaluates a compiled expression.
   */
  execute<T = ExpressionValue>(
    expression: CompiledExpression,
    context?: ExpressionContext,
  ): ExpressionResult<T>;

  /**
   * Determines whether an expression is valid.
   */
  validate(
    expression: Expression,
  ): ExpressionDiagnostics;

  /**
   * Clears any internal caches.
   */
  clear(): void;
}

/**
 * Base Expression Engine error.
 */
export class ExpressionEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpressionEngineError";
  }
}