// website/lib/ai/intent/keywords.ts

import type { AIIntent } from "../core";

export const INTENT_KEYWORDS: Record<
  AIIntent,
  readonly string[]
> = {
  unknown: [],

  greeting: [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
  ],

  new_patient: [
    "new patient",
    "first visit",
    "never been",
    "first appointment",
  ],

  existing_patient: [
    "existing patient",
    "returning",
    "follow up",
    "follow-up",
  ],

  book_appointment: [
    "appointment",
    "book",
    "schedule",
    "cleaning",
    "checkup",
    "exam",
    "visit",
  ],

  reschedule_appointment: [
    "reschedule",
    "move appointment",
    "change appointment",
    "different day",
  ],

  cancel_appointment: [
    "cancel",
    "cancel appointment",
    "cannot come",
    "won't make it",
  ],

  pricing: [
    "price",
    "pricing",
    "cost",
    "fee",
    "charges",
    "payment",
  ],

  insurance: [
    "insurance",
    "delta dental",
    "aetna",
    "metlife",
    "cigna",
    "guardian",
  ],

  office_hours: [
    "hours",
    "open",
    "close",
    "weekend",
    "today",
  ],

  billing: [
    "bill",
    "billing",
    "invoice",
    "receipt",
    "balance",
  ],

  general_question: [
    "location",
    "address",
    "parking",
    "email",
    "website",
  ],

  emergency: [
    "emergency",
    "pain",
    "bleeding",
    "swollen",
    "broken tooth",
    "infection",
    "urgent",
  ],

  human_agent: [
    "person",
    "human",
    "representative",
    "staff",
    "receptionist",
    "front desk",
  ],

  goodbye: [
    "bye",
    "goodbye",
    "thanks",
    "thank you",
    "see you",
  ],
};