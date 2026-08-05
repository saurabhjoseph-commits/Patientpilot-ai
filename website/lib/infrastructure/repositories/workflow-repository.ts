/**
 * PatientPilot AI
 * Infrastructure Layer
 * Workflow Repository
 *
 * Repository responsible for workflow execution
 * persistence and history.
 */

import {
  DatabaseProvider,
  database,
} from "../persistence/database";

export type WorkflowExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface WorkflowExecutionRecord {
  readonly id: string;
  readonly workflowId: string;
  readonly clinicId: string;
  readonly status: WorkflowExecutionStatus;
  readonly startedAt: Date;
  readonly completedAt?: Date;
  readonly input?: Readonly<Record<string, unknown>>;
  readonly output?: Readonly<Record<string, unknown>>;
}

export interface CreateWorkflowExecutionRecord {
  readonly workflowId: string;
  readonly clinicId: string;
  readonly input?: Readonly<Record<string, unknown>>;
}

export interface UpdateWorkflowExecutionRecord {
  readonly status?: WorkflowExecutionStatus;
  readonly completedAt?: Date;
  readonly output?: Readonly<Record<string, unknown>>;
}

export interface WorkflowRepository {
  create(
    record: CreateWorkflowExecutionRecord,
  ): Promise<WorkflowExecutionRecord>;

  update(
    id: string,
    record: UpdateWorkflowExecutionRecord,
  ): Promise<WorkflowExecutionRecord>;

  findById(
    id: string,
  ): Promise<WorkflowExecutionRecord | null>;

  findByClinic(
    clinicId: string,
  ): Promise<readonly WorkflowExecutionRecord[]>;

  findByWorkflow(
    workflowId: string,
  ): Promise<readonly WorkflowExecutionRecord[]>;

  delete(
    id: string,
  ): Promise<boolean>;
}

/**
 * Default Workflow Repository.
 */
export class DefaultWorkflowRepository
  implements WorkflowRepository
{
  constructor(
    private readonly provider: DatabaseProvider =
      database,
  ) {}

  async create(
    record: CreateWorkflowExecutionRecord,
  ): Promise<WorkflowExecutionRecord> {
    void this.provider;

    return {
      id: crypto.randomUUID(),
      workflowId: record.workflowId,
      clinicId: record.clinicId,
      status: "pending",
      startedAt: new Date(),
      input: record.input,
    };
  }

  async update(
    id: string,
    record: UpdateWorkflowExecutionRecord,
  ): Promise<WorkflowExecutionRecord> {
    return {
      id,
      workflowId: "",
      clinicId: "",
      status: record.status ?? "pending",
      startedAt: new Date(),
      completedAt: record.completedAt,
      output: record.output,
    };
  }

  async findById(
    id: string,
  ): Promise<WorkflowExecutionRecord | null> {
    void id;

    return null;
  }

  async findByClinic(
    clinicId: string,
  ): Promise<readonly WorkflowExecutionRecord[]> {
    void clinicId;

    return [];
  }

  async findByWorkflow(
    workflowId: string,
  ): Promise<readonly WorkflowExecutionRecord[]> {
    void workflowId;

    return [];
  }

  async delete(
    id: string,
  ): Promise<boolean> {
    void id;

    return true;
  }
}

/**
 * Creates a Workflow Repository.
 */
export function createWorkflowRepository(): WorkflowRepository {
  return new DefaultWorkflowRepository();
}

/**
 * Shared Workflow Repository.
 */
export const workflowRepository =
  createWorkflowRepository();

/**
 * Default Workflow Repository.
 */
export default workflowRepository;