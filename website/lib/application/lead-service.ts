/**
 * PatientPilot AI
 * Application Layer
 * Lead Service
 *
 * Coordinates lead lifecycle operations and delegates
 * business rules, workflows, events and integrations
 * to the platform runtime.
 */

import {
  EventBus,
} from "../platform/contracts/event-bus";

import {
  WorkflowEngine,
} from "../platform/contracts/workflow-engine";

import {
  RuleEngine,
} from "../platform/contracts/rule-engine";

import {
  IntegrationManager,
} from "../platform/contracts/integration-manager";

import {
  eventBus,
} from "../platform/runtime/event-bus";

import {
  workflowEngine,
} from "../platform/runtime/workflow-engine";

import {
  ruleEngine,
} from "../platform/runtime/rule-engine";

import {
  integrationManager,
} from "../platform/runtime/integration-manager";

export interface LeadRequest {
  readonly clinicId: string;
  readonly firstName: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly source?: string;
}

export interface LeadResult {
  readonly success: boolean;
  readonly leadId?: string;
  readonly message?: string;
}

export interface LeadService {
  create(
    request: LeadRequest,
  ): Promise<LeadResult>;

  update(
    leadId: string,
    request: Partial<LeadRequest>,
  ): Promise<LeadResult>;

  archive(
    leadId: string,
  ): Promise<LeadResult>;
}

/**
 * Default Lead Service.
 */
export class DefaultLeadService
  implements LeadService
{
  constructor(
    private readonly workflows: WorkflowEngine =
      workflowEngine,
    private readonly rules: RuleEngine =
      ruleEngine,
    private readonly integrations: IntegrationManager =
      integrationManager,
    private readonly events: EventBus =
      eventBus,
  ) {}

  async create(
    request: LeadRequest,
  ): Promise<LeadResult> {
    // Future milestones:
    // - Validate lead
    // - Execute lead qualification rules
    // - Execute onboarding workflow
    // - Publish LeadCreated event
    // - Sync CRM

    void this.workflows;
    void this.rules;
    void this.integrations;
    void this.events;
    void request;

    return {
      success: true,
      leadId: crypto.randomUUID(),
      message: "Lead created.",
    };
  }

  async update(
    leadId: string,
    request: Partial<LeadRequest>,
  ): Promise<LeadResult> {
    void request;

    return {
      success: true,
      leadId,
      message: "Lead updated.",
    };
  }

  async archive(
    leadId: string,
  ): Promise<LeadResult> {
    return {
      success: true,
      leadId,
      message: "Lead archived.",
    };
  }
}

/**
 * Creates a Lead Service.
 */
export function createLeadService(): LeadService {
  return new DefaultLeadService();
}

/**
 * Shared Lead Service.
 */
export const leadService =
  createLeadService();

/**
 * Default Lead Service.
 */
export default leadService;