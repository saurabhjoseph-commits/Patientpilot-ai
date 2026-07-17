// website/lib/ai/intent/classifier.ts

import type {
  AIConversationState,
  AIIntent,
  ConversationAnalysis,
} from "../core";

import { INTENT_KEYWORDS } from "./keywords";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ");
}

function detectIntent(text: string): AIIntent {
  const input = normalize(text);

  let bestIntent: AIIntent = "unknown";
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(
    INTENT_KEYWORDS,
  ) as [AIIntent, readonly string[]][]) {
    const score = keywords.filter((keyword) =>
      input.includes(keyword),
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return bestIntent;
}

function nextState(
  intent: AIIntent,
): AIConversationState {
  switch (intent) {
    case "book_appointment":
    case "new_patient":
      return "collecting_name";

    case "reschedule_appointment":
    case "cancel_appointment":
      return "collecting_name";

    case "emergency":
      return "handoff";

    case "goodbye":
      return "ended";

    default:
      return "greeting";
  }
}

export function classifyIntent(
  message: string,
): ConversationAnalysis {
  const intent = detectIntent(message);

  const confidence =
    intent === "unknown" ? 0.4 : 0.9;

  return {
    intent,

    nextState: nextState(intent),

    completed: false,

    shouldHangup:
      intent === "goodbye",

    needsHuman:
      intent === "emergency" ||
      intent === "human_agent",

    confidence,

    missingFields: [],

    summary: `Detected intent: ${intent}`,
  };
}