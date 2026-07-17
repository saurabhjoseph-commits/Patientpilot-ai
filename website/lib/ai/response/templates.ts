// website/lib/ai/response/templates.ts

import type { AIIntent } from "../core";

export interface ResponseTemplate {
  message: string;
  requiresName?: boolean;
}

export const RESPONSE_TEMPLATES: Record<AIIntent, ResponseTemplate> = {
  unknown: {
    message:
      "I'm here to help. Could you tell me a little more about what you need today?",
  },

  greeting: {
    message:
      "Hello! Thank you for calling {{clinicName}}. How may I help you today?",
  },

  new_patient: {
    message:
      "Welcome! I'd be happy to help you schedule your first appointment.",
  },

  existing_patient: {
    message:
      "Welcome back! How can I help you today?",
  },

  book_appointment: {
    message:
      "I'd be happy to help schedule your appointment.",
    requiresName: true,
  },

  reschedule_appointment: {
    message:
      "Certainly. Let's reschedule your appointment.",
    requiresName: true,
  },

  cancel_appointment: {
    message:
      "I can help cancel your appointment.",
    requiresName: true,
  },

  pricing: {
    message:
      "I'd be happy to answer your pricing questions.",
  },

  insurance: {
    message:
      "I'd be happy to help with your insurance questions.",
  },

  office_hours: {
    message:
      "I'd be happy to provide our office hours.",
  },

  billing: {
    message:
      "I'd be happy to help with billing questions.",
  },

  general_question: {
    message:
      "I'd be happy to answer your question.",
  },

  emergency: {
    message:
      "I'm sorry you're experiencing a dental emergency. I'll help connect you with the clinic immediately.",
  },

  human_agent: {
    message:
      "Certainly. I'll connect you with a member of our team.",
  },

  goodbye: {
    message:
      "Thank you for calling. Have a wonderful day!",
  },
};