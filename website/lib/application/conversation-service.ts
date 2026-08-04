/**
 * PatientPilot AI
 * Application Layer
 * Conversation Service
 *
 * Coordinates AI conversations and delegates business
 * operations to the platform runtime.
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
  eventBus,
} from "../platform/runtime/event-bus";

import {
  workflowEngine,
} from "../platform/runtime/workflow-engine";

import {
  ruleEngine,
} from "../platform/runtime/rule-engine";

export interface ConversationMessage {
  readonly role: "patient" | "assistant";
  readonly text: string;
  readonly timestamp: Date;
}

export interface ConversationContext {
  readonly conversationId: string;
  readonly clinicId: string;
  readonly patientId?: string;
  readonly messages: readonly ConversationMessage[];
}

export interface ConversationResult {
  readonly success: boolean;
  readonly response: string;
}

export interface ConversationService {
  respond(
    context: ConversationContext,
  ): Promise<ConversationResult>;

  end(
    conversationId: string,
  ): Promise<void>;
}

/**
 * Default Conversation Service.
 */
export class DefaultConversationService
  implements ConversationService
{
  constructor(
    private readonly workflows: WorkflowEngine =
      workflowEngine,
    private readonly rules: RuleEngine =
      ruleEngine,
    private readonly events: EventBus =
      eventBus,
  ) {}

  async respond(
    context: ConversationContext,
  ): Promise<ConversationResult> {
    // Future milestones will:
    // - evaluate business rules
    // - execute workflows
    // - invoke AI providers
    // - publish conversation events

    void this.workflows;
    void this.rules;
    void this.events;
    void context;

    return {
      success: true,
      response: "Conversation processed.",
    };
  }

  async end(
    conversationId: string,
  ): Promise<void> {
    void conversationId;

    // Future milestone:
    // publish ConversationEnded event
  }
}

/**
 * Creates a Conversation Service.
 */
export function createConversationService(): ConversationService {
  return new DefaultConversationService();
}

/**
 * Shared Conversation Service.
 */
export const conversationService =
  createConversationService();

/**
 * Default Conversation Service.
 */
export default conversationService;