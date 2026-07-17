// website/lib/ai/decision/types.ts

import type {
  AIConversationSession,
} from "@/lib/ai/core/session";

import type {
  AIIntent,
} from "@/lib/ai/core/analysis";

import type {
  AIToolName,
} from "@/lib/ai/tools";

export interface DecisionResult {
  action:
    | "ask"
    | "execute"
    | "handoff"
    | "complete";

  nextQuestion?: string;

  tool?: AIToolName;

  reason: string;

  missingFields: string[];
}

export interface DecisionContext {
  session: AIConversationSession;

  intent: AIIntent;
}