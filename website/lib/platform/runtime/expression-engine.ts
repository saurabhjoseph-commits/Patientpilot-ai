import {
  CompiledExpression,
  Expression,
  ExpressionContext,
  ExpressionDiagnostics,
  ExpressionEngine,
  ExpressionEngineError,
  ExpressionResult,
  ExpressionValue,
} from "../contracts/expression-engine";

/**
 * Default runtime implementation of the Expression Engine.
 *
 * NOTE:
 * This implementation intentionally does not execute arbitrary
 * JavaScript. It provides a safe, extensible foundation that will
 * evolve into PatientPilot AI's expression language.
 */
export class DefaultExpressionEngine implements ExpressionEngine {
  private readonly cache = new Map<
    Expression,
    CompiledExpression
  >();

  compile(
    expression: Expression,
  ): CompiledExpression {
    const source = expression.trim();

    if (!source) {
      throw new ExpressionEngineError(
        "Expression cannot be empty.",
      );
    }

    const cached = this.cache.get(source);

    if (cached) {
      return cached;
    }

    const compiled: CompiledExpression = Object.freeze({
      id: source,
      source,
      compiledAt: new Date(),
    });

    this.cache.set(source, compiled);

    return compiled;
  }

  evaluate<T = ExpressionValue>(
    expression: Expression,
    context?: ExpressionContext,
  ): ExpressionResult<T> {
    const compiled = this.compile(expression);

    return this.execute<T>(compiled, context);
  }

  execute<T = ExpressionValue>(
    expression: CompiledExpression,
    context?: ExpressionContext,
  ): ExpressionResult<T> {
    const started = Date.now();

    // Placeholder implementation.
    // A future milestone will replace this with the
    // PatientPilot expression evaluator.

    const diagnostics: ExpressionDiagnostics = {
      success: true,
      messages: [],
      durationMs: Date.now() - started,
    };

    return {
      value: undefined as T,
      diagnostics,
    };
  }

  validate(
    expression: Expression,
  ): ExpressionDiagnostics {
    const started = Date.now();

    try {
      this.compile(expression);

      return {
        success: true,
        messages: [],
        durationMs: Date.now() - started,
      };
    } catch (error) {
      return {
        success: false,
        messages: [
          error instanceof Error
            ? error.message
            : "Expression validation failed.",
        ],
        durationMs: Date.now() - started,
      };
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Creates a new Expression Engine.
 */
export function createExpressionEngine(): ExpressionEngine {
  return new DefaultExpressionEngine();
}

/**
 * Shared platform Expression Engine.
 */
export const expressionEngine: ExpressionEngine =
  createExpressionEngine();

/**
 * Default platform Expression Engine.
 */
export default expressionEngine;