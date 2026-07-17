// website/lib/ai/workflow/orchestrator.ts

import {
  processConversation,
} from "./conversation";

import {
  executeWorkflow,
} from "./execution";

import {
  generateWorkflowResponse,
} from "./response";

import type {
  AIContext,
  AIIntent,
  AIMessage,
  AIResponse,
} from "@/lib/ai/types";

export interface WorkflowRequest {
  callId: string;
  message: AIMessage;
  context: AIContext;
  intent: AIIntent;
}

export async function runWorkflow(
  request: WorkflowRequest,
): Promise<AIResponse> {

  const conversation =
    await processConversation({
      callId: request.callId,
      message: request.message,
      intent: request.intent,
    });

  const execution =
    await executeWorkflow({
      callId: request.callId,
      workflow: conversation.workflow,
      session: conversation.session,
    });

  return generateWorkflowResponse({
    context: request.context,
    session: execution.session,
    latestMessage: request.message,
  });
}