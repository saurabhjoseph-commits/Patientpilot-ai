// components/demo/live/ConversationScheduler.ts

import type {
  ConversationMessage,
  DemoScenario,
} from "./types";

export interface ConversationStep {
  message: ConversationMessage;
  index: number;
  delay: number;
  isLast: boolean;
}

export class ConversationScheduler {
  private readonly messages: ConversationMessage[];

  constructor(scenario: DemoScenario) {
    this.messages = scenario.messages;
  }

  /**
   * Total messages
   */
  get totalMessages(): number {
    return this.messages.length;
  }

  /**
   * Get message by index
   */
  getMessage(
    index: number
  ): ConversationMessage | undefined {
    return this.messages[index];
  }

  /**
   * Visible messages
   */
  getVisibleMessages(
    currentIndex: number
  ): ConversationMessage[] {
    if (currentIndex < 0) {
      return [];
    }

    return this.messages.slice(0, currentIndex + 1);
  }

  /**
   * Build scheduler step
   */
  getStep(
    currentIndex: number
  ): ConversationStep | null {
    const message =
      this.messages[currentIndex];

    if (!message) {
      return null;
    }

    return {
      message,
      index: currentIndex,
      delay: message.delay,
      isLast:
        currentIndex ===
        this.messages.length - 1,
    };
  }

  /**
   * Next index
   */
  getNextIndex(
    currentIndex: number
  ): number | null {
    const next = currentIndex + 1;

    return next >= this.messages.length
      ? null
      : next;
  }

  /**
   * Previous index
   */
  getPreviousIndex(
    currentIndex: number
  ): number | null {
    const previous = currentIndex - 1;

    return previous < 0
      ? null
      : previous;
  }

  /**
   * Completion percentage
   */
  getProgress(
    currentIndex: number
  ): number {
    if (!this.messages.length) {
      return 0;
    }

    return Math.min(
      Math.round(
        ((currentIndex + 1) /
          this.messages.length) *
          100
      ),
      100
    );
  }

  /**
   * Is complete?
   */
  isComplete(
    currentIndex: number
  ): boolean {
    return (
      currentIndex >=
      this.messages.length - 1
    );
  }

  /**
   * Reset
   */
  reset(): number {
    return 0;
  }
}