import {
  RuleDefinition,
  RuleEngine,
  RuleEngineError,
  RuleExecutionContext,
  RuleExecutionResult,
} from "../contracts/rule-engine";

import { ExpressionEngine } from "../contracts/expression-engine";

import { expressionEngine } from "./expression-engine";

/**
 * Default runtime implementation of the Rule Engine.
 */
export class DefaultRuleEngine implements RuleEngine {
  private readonly rules = new Map<string, RuleDefinition>();

  constructor(
    private readonly expressions: ExpressionEngine = expressionEngine,
  ) {}

  register(rule: RuleDefinition): void {
    if (this.rules.has(rule.id)) {
      throw new RuleEngineError(
        `Rule "${rule.id}" is already registered.`,
      );
    }

    this.rules.set(rule.id, Object.freeze(rule));
  }

  unregister(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  list(): readonly RuleDefinition[] {
    return Object.freeze(
      [...this.rules.values()].sort(
        (a, b) => b.priority - a.priority,
      ),
    );
  }

  execute(
    context: RuleExecutionContext,
  ): readonly RuleExecutionResult[] {
    const results: RuleExecutionResult[] = [];

    for (const rule of this.list()) {
      if (!rule.enabled) {
        continue;
      }

      const evaluation =
        this.expressions.evaluate<boolean>(
          rule.condition,
          context,
        );

      const matched =
        evaluation.diagnostics.success &&
        evaluation.value === true;

      results.push({
        success: evaluation.diagnostics.success,
        matched,
        executedActions: matched
          ? [...rule.actions]
          : [],
      });
    }

    return Object.freeze(results);
  }

  clear(): void {
    this.rules.clear();
  }
}

/**
 * Creates a new Rule Engine.
 */
export function createRuleEngine(
  expressions: ExpressionEngine = expressionEngine,
): RuleEngine {
  return new DefaultRuleEngine(expressions);
}

/**
 * Shared platform Rule Engine.
 */
export const ruleEngine: RuleEngine =
  createRuleEngine();

/**
 * Default Rule Engine.
 */
export default ruleEngine;