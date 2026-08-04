/**
 * ============================================================
 * PatientPilot AI
 * Intent Classifier
 * ============================================================
 *
 * Uses the canonical AIIntent domain model.
 */

import type { AIIntent } from "./core";

export interface IntentClassification {
  readonly intent: AIIntent;
  readonly confidence: number;
}

export interface IntentClassifier {
  classify(message: string): IntentClassification;
}

export class KeywordIntentClassifier
  implements IntentClassifier
{
  classify(
    message: string,
  ): IntentClassification {
    const text = message.toLowerCase();

    if (
      this.matches(text, [
        "hello",
        "hi",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
      ])
    ) {
      return this.result("greeting", 0.99);
    }

    if (
      this.matches(text, [
        "new patient",
        "first visit",
        "never been",
      ])
    ) {
      return this.result("new_patient", 0.98);
    }

    if (
      this.matches(text, [
        "existing patient",
        "returning",
        "my appointment",
      ])
    ) {
      return this.result(
        "existing_patient",
        0.95,
      );
    }

    if (
      this.matches(text, [
        "book",
        "schedule",
        "make appointment",
      ])
    ) {
      return this.result(
        "book_appointment",
        0.98,
      );
    }

    if (
      this.matches(text, [
        "reschedule",
        "move appointment",
        "change appointment",
      ])
    ) {
      return this.result(
        "reschedule_appointment",
        0.99,
      );
    }

    if (
      this.matches(text, [
        "cancel",
        "cancel appointment",
      ])
    ) {
      return this.result(
        "cancel_appointment",
        0.99,
      );
    }

    if (
      this.matches(text, [
        "price",
        "pricing",
        "cost",
        "fee",
      ])
    ) {
      return this.result(
        "pricing",
        0.96,
      );
    }

    if (
      this.matches(text, [
        "insurance",
        "coverage",
      ])
    ) {
      return this.result(
        "insurance",
        0.96,
      );
    }

    if (
      this.matches(text, [
        "hours",
        "office hours",
        "open",
        "close",
      ])
    ) {
      return this.result(
        "office_hours",
        0.96,
      );
    }

    if (
      this.matches(text, [
        "bill",
        "billing",
        "invoice",
        "payment",
      ])
    ) {
      return this.result(
        "billing",
        0.96,
      );
    }

    if (
      this.matches(text, [
        "pain",
        "swollen",
        "bleeding",
        "broken tooth",
        "emergency",
      ])
    ) {
      return this.result(
        "emergency",
        0.99,
      );
    }

    if (
      this.matches(text, [
        "human",
        "person",
        "staff",
        "representative",
      ])
    ) {
      return this.result(
        "human_agent",
        0.99,
      );
    }

    if (
      this.matches(text, [
        "bye",
        "goodbye",
        "thank you",
        "thanks",
      ])
    ) {
      return this.result(
        "goodbye",
        0.95,
      );
    }

    return this.result(
      "general_question",
      0.70,
    );
  }

  private matches(
    text: string,
    keywords: readonly string[],
  ): boolean {
    return keywords.some(
      (keyword) =>
        text.includes(keyword),
    );
  }

  private result(
    intent: AIIntent,
    confidence: number,
  ): IntentClassification {
    return {
      intent,
      confidence,
    };
  }
}

export function createIntentClassifier(): IntentClassifier {
  return new KeywordIntentClassifier();
}

export const intentClassifier =
  createIntentClassifier();

export default intentClassifier;