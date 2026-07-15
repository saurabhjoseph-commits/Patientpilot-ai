// components/demo/live/stage.ts

import type {
  ConversationMessage,
  DemoStage,
} from "./types";

/**
 * Determine the current stage of the demo
 * based on the visible conversation.
 */
export function getDemoStage(
  currentIndex: number,
  messages: ConversationMessage[]
): DemoStage {
  if (messages.length === 0) {
    return "idle";
  }

  if (currentIndex < 0) {
    return "idle";
  }

  if (currentIndex === 0) {
    return "ringing";
  }

  if (currentIndex === 1) {
    return "connected";
  }

  const lastIndex = messages.length - 1;

  if (currentIndex >= lastIndex) {
    return "completed";
  }

  const current = messages[currentIndex];

  if (!current) {
    return "conversation";
  }

  // Booking stage
  if (
    current.text.toLowerCase().includes("appointment") &&
    (
      current.text.toLowerCase().includes("scheduled") ||
      current.text.toLowerCase().includes("booked")
    )
  ) {
    return "booking";
  }

  // CRM stage
  if (
    current.text.toLowerCase().includes("confirmation") ||
    current.text.toLowerCase().includes("sms") ||
    current.text.toLowerCase().includes("email")
  ) {
    return "crm_update";
  }

  // AI reasoning stage
  if (
    current.speaker === "ai" &&
    (
      current.text.toLowerCase().includes("insurance") ||
      current.text.toLowerCase().includes("available") ||
      current.text.toLowerCase().includes("appointment")
    )
  ) {
    return "thinking";
  }

  return "conversation";
}

/**
 * Demo completion percentage.
 */
export function getDemoProgress(
  currentIndex: number,
  totalMessages: number
): number {
  if (totalMessages <= 0) {
    return 0;
  }

  return Math.min(
    Math.round(((currentIndex + 1) / totalMessages) * 100),
    100
  );
}

export function isConversationStage(
  stage: DemoStage
) {
  return stage === "conversation";
}

export function isThinkingStage(
  stage: DemoStage
) {
  return stage === "thinking";
}

export function isBookingStage(
  stage: DemoStage
) {
  return stage === "booking";
}

export function isCRMStage(
  stage: DemoStage
) {
  return stage === "crm_update";
}

export function isCompletedStage(
  stage: DemoStage
) {
  return stage === "completed";
}