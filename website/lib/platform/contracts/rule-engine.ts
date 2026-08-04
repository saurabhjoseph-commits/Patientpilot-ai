/**
 * PatientPilot AI
 * Platform Runtime - Rule Engine Contract
 *
 * Defines the public API for evaluating business rules.
 */

import {
  Expression,
  ExpressionContext,
} from "./expression-engine";

export type RuleId = string;
export type RuleName = string;
export type RulePriority = number;

export interface RuleAction {
  /**
   * Action identifier.
   */
  readonly type: string;

  /**
   * Optional action payload.
   */
  readonly payload?: Readonly<Record<string, unknown>>;
}

export interface RuleDefinition {
  /**
   * Unique rule identifier.
   */
  readonly id: RuleId;

  /**
   * Friendly rule name.
   */
  readonly name: RuleName;

  /**
   * Execution priority.
   * Higher values execute first.
   */
  readonly priority: RulePriority;

  /**
   * Enable / disable rule.
   */
  readonly enabled: boolean;

  /**
   * Boolean expression.
   */
  readonly condition: Expression;

  /**
   * Actions executed when condition evaluates true.
   */
  readonly actions: readonly RuleAction[];
}

export interface RuleExecutionContext
  extends ExpressionContext {}

export interface RuleExecutionResult {
  /**
   * Rule evaluated successfully.
   */
  readonly success: boolean;

  /**
   * Condition result.
   */
  readonly matched: boolean;

  /**
   * Executed actions.
   */
  readonly executedActions: readonly RuleAction[];
}

export interface RuleEngine {
  /**
   * Register a rule.
   */
  register(
    rule: RuleDefinition,
  ): void;

  /**
   * Remove a rule.
   */
  unregister(
    ruleId: RuleId,
  ): boolean;

  /**
   * Execute all matching rules.
   */
  execute(
    context: RuleExecutionContext,
  ): readonly RuleExecutionResult[];

  /**
   * Return registered rules.
   */
  list(): readonly RuleDefinition[];

  /**
   * Remove every rule.
   */
  clear(): void;
}

/**
 * Base Rule Engine error.
 */
export class RuleEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RuleEngineError";
  }
}