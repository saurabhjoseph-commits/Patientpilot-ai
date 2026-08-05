/**
 * PatientPilot AI
 * Application Layer
 * Follow-up Service
 *
 * Coordinates patient follow-up workflows such as
 * appointment reminders, missed-call recovery,
 * treatment recalls and post-visit communication.
 */

import {
  WorkflowEngine,
} from "../platform/contracts/workflow-engine";

import {
  IntegrationManager,
} from "../platform/contracts/integration-manager";

import {
  EventBus,
} from "../platform/contracts/event-bus";

import {
  workflowEngine,
} from "../platform/runtime/workflow-engine";

import {
  integrationManager,
} from "../platform/runtime/integration-manager";

import {
  eventBus,
} from "../platform/runtime/event-bus";

export type FollowUpType =
  | "appointment-reminder"
  | "missed-call"
  | "treatment-recall"
  | "post-visit"
  | "custom";

export interface FollowUpRequest {
  readonly patientId: string;
  readonly clinicId: string;
  readonly type: FollowUpType;
  readonly scheduledAt: Date;
  readonly message?: string;
}

export interface FollowUpResult {
  readonly success: boolean;
  readonly followUpId?: string;
  readonly message?: string;
}

export interface FollowUpService {
  schedule(
    request: FollowUpRequest,
  ): Promise<FollowUpResult>;

  cancel(
    followUpId: string,
  ): Promise<FollowUpResult>;

  execute(
    followUpId: string,
  ): Promise<FollowUpResult>;
}

/**
 * Default Follow-up Service.
 */
export class DefaultFollowUpService
  implements FollowUpService
{
  constructor(
    private readonly workflows: WorkflowEngine =
      workflowEngine,
    private readonly integrations: IntegrationManager =
      integrationManager,
    private readonly events: EventBus =
      eventBus,
  ) {}

  async schedule(
    request: FollowUpRequest,
  ): Promise<FollowUpResult> {
    // Future milestones:
    // - Validate request
    // - Execute workflow
    // - Persist schedule
    // - Publish FollowUpScheduled event

    void this.workflows;
    void this.integrations;
    void this.events;
    void request;

    return {
      success: true,
      followUpId: crypto.randomUUID(),
      message: "Follow-up scheduled.",
    };
  }

  async cancel(
    followUpId: string,
  ): Promise<FollowUpResult> {
    return {
      success: true,
      followUpId,
      message: "Follow-up cancelled.",
    };
  }

  async execute(
    followUpId: string,
  ): Promise<FollowUpResult> {
    return {
      success: true,
      followUpId,
      message: "Follow-up executed.",
    };
  }
}

/**
 * Creates a Follow-up Service.
 */
export function createFollowUpService(): FollowUpService {
  return new DefaultFollowUpService();
}

/**
 * Shared Follow-up Service.
 */
export const followUpService =
  createFollowUpService();

/**
 * Default Follow-up Service.
 */
export default followUpService;