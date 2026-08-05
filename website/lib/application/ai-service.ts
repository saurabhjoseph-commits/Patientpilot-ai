/**
 * PatientPilot AI
 * Application Layer
 * AI Service
 *
 * Coordinates AI interactions and delegates model execution
 * to registered AI integrations while orchestrating business
 * workflows.
 */

import {
  IntegrationManager,
  IntegrationRequest,
} from "../platform/contracts/integration-manager";

import {
  WorkflowEngine,
} from "../platform/contracts/workflow-engine";

import {
  EventBus,
} from "../platform/contracts/event-bus";

import {
  integrationManager,
} from "../platform/runtime/integration-manager";

import {
  workflowEngine,
} from "../platform/runtime/workflow-engine";

import {
  eventBus,
} from "../platform/runtime/event-bus";

export interface AIRequest {
  readonly clinicId: string;
  readonly conversationId?: string;
  readonly patientId?: string;
  readonly prompt: string;
  readonly metadata?: Readonly<
    Record<string, unknown>
  >;
}

export interface AIResponse {
  readonly success: boolean;
  readonly response: string;
  readonly provider?: string;
}

export interface AIService {
  generate(
    request: AIRequest,
  ): Promise<AIResponse>;
}

export class DefaultAIService
  implements AIService
{
  constructor(
    private readonly integrations: IntegrationManager =
      integrationManager,
    private readonly workflows: WorkflowEngine =
      workflowEngine,
    private readonly events: EventBus =
      eventBus,
  ) {}

  async generate(
    request: AIRequest,
  ): Promise<AIResponse> {
    // Future milestones:
    // - Execute AI workflow
    // - Resolve provider
    // - Invoke OpenAI/other AI provider
    // - Publish AI events

    void this.workflows;
    void this.events;

    const integrationRequest: IntegrationRequest = {
      payload: {
        prompt: request.prompt,
        clinicId: request.clinicId,
        conversationId: request.conversationId,
        patientId: request.patientId,
        metadata: request.metadata,
      },
    };

    void integrationRequest;
    void this.integrations;

    return {
      success: true,
      response: "AI response generated.",
      provider: "placeholder",
    };
  }
}

/**
 * Creates an AI Service.
 */
export function createAIService(): AIService {
  return new DefaultAIService();
}

/**
 * Shared AI Service.
 */
export const aiService =
  createAIService();

/**
 * Default AI Service.
 */
export default aiService;