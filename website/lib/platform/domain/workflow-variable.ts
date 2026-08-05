// website/lib/platform/domain/workflow-variable.ts

/**
 * PatientPilot AI
 * Workflow Variables
 *
 * Runtime variables shared across workflow
 * execution and step execution.
 */

export type WorkflowVariableType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "object"
  | "array";

export interface WorkflowVariable {
  id: string;

  workflowDefinitionId: string;

  name: string;

  type: WorkflowVariableType;

  required: boolean;

  defaultValue?: unknown;

  description?: string;

  createdAt: Date;

  updatedAt: Date;
}

export interface WorkflowVariableValue {
  variableId: string;

  value: unknown;

  updatedAt: Date;
}

export function createVariableMap(
  values: WorkflowVariableValue[],
): Record<string, unknown> {
  return values.reduce<
    Record<string, unknown>
  >((map, value) => {
    map[value.variableId] =
      value.value;

    return map;
  }, {});
}

export function getVariableValue<T>(
  values: WorkflowVariableValue[],
  variableId: string,
): T | undefined {
  return values.find(
    (v) =>
      v.variableId === variableId,
  )?.value as T | undefined;
}