/**
 * PatientPilot AI
 * Platform Runtime - Workflow Engine Contract
 *
 * Defines the orchestration contract for executing
 * business workflows across the platform.
 */

import { EventName } from "./event-bus";
import { ExpressionValue } from "./expression-engine";

export type WorkflowId = string;
export type WorkflowName = string;
export type WorkflowVersion = string;

export interface WorkflowStep {
  /**
   * Unique step identifier.
   */
  readonly id: string;

  /**
   * Human-readable step name.
   */
  readonly name: string;

  /**
   * Event that triggers this step.
   */
  readonly event: EventName;

  /**
   * Optional rule IDs evaluated before execution.
   */
  readonly rules?: readonly string[];
}

export interface WorkflowDefinition {
  /**
   * Unique workflow identifier.
   */
  readonly id: WorkflowId;

  /**
   * Friendly workflow name.
   */
  readonly name: WorkflowName;

  /**
   * Workflow version.
   */
  readonly version: WorkflowVersion;

  /**
   * Enable or disable workflow.
   */
  readonly enabled: boolean;

  /**
   * Ordered workflow steps.
   */
  readonly steps: readonly WorkflowStep[];
}

export interface WorkflowExecutionContext {
  /**
   * Event that initiated execution.
   */
  readonly event: EventName;

  /**
   * Workflow execution data.
   * Shared with the Expression Engine and Rule Engine.
   */
  readonly data?: Readonly<
    Record<string, ExpressionValue>
  >;
}

export interface WorkflowExecutionResult {
  /**
   * Workflow executed successfully.
   */
  readonly success: boolean;

  /**
   * Executed workflow identifier.
   */
  readonly workflowId: WorkflowId;

  /**
   * Executed step identifiers.
   */
  readonly completedSteps: readonly string[];
}

export interface WorkflowEngine {
  /**
   * Register a workflow.
   */
  register(
    workflow: WorkflowDefinition,
  ): void;

  /**
   * Remove a workflow.
   */
  unregister(
    workflowId: WorkflowId,
  ): boolean;

  /**
   * Execute matching workflows.
   */
  execute(
    context: WorkflowExecutionContext,
  ): readonly WorkflowExecutionResult[];

  /**
   * List registered workflows.
   */
  list(): readonly WorkflowDefinition[];

  /**
   * Remove all workflows.
   */
  clear(): void;
}

/**
 * Base Workflow Engine error.
 */
export class WorkflowEngineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkflowEngineError";
  }
}