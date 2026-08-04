// website/lib/ai/schema.ts

/**
 * ============================================================
 * PatientPilot AI
 * Structured Response Schema
 * Compatible with OpenAI SDK 6.x Responses API
 * ============================================================
 */

export const conversationResponseSchema = {
  name: "patientpilot_conversation",

  strict: true,

  schema: {
    type: "object",

    additionalProperties: false,

    properties: {
      message: {
        type: "string",
      },

      speech: {
        type: "string",
      },

      intent: {
        type: "string",

        enum: [
          "unknown",
          "greeting",
          "new_patient",
          "existing_patient",
          "book_appointment",
          "reschedule_appointment",
          "cancel_appointment",
          "pricing",
          "insurance",
          "office_hours",
          "billing",
          "general_question",
          "emergency",
          "human_agent",
          "goodbye",
        ],
      },

      confidence: {
        type: "number",
      },

      shouldHangup: {
        type: "boolean",
      },

      actions: {
        type: "array",

        items: {
          type: "string",

          enum: [
            "NONE",
            "BOOK_APPOINTMENT",
            "RESCHEDULE_APPOINTMENT",
            "CANCEL_APPOINTMENT",
            "SEND_SMS_CONFIRMATION",
            "SEND_EMAIL_CONFIRMATION",
            "TRANSFER_TO_HUMAN",
            "END_CALL",
          ],
        },
      },

      analysis: {
        type: "object",

        additionalProperties: false,

        properties: {
          intent: {
            type: "string",
          },

          nextState: {
            type: "string",
          },

          completed: {
            type: "boolean",
          },

          shouldHangup: {
            type: "boolean",
          },

          needsHuman: {
            type: "boolean",
          },

          confidence: {
            type: "number",
          },

          missingFields: {
            type: "array",

            items: {
              type: "string",
            },
          },

          summary: {
            type: "string",
          },
        },

        required: [
          "intent",
          "nextState",
          "completed",
          "shouldHangup",
          "needsHuman",
          "confidence",
          "missingFields",
          "summary",
        ],
      },

      appointment: {
        type: ["object", "null"],

        additionalProperties: false,

        properties: {
          patientName: {
            type: ["string", "null"],
          },

          phoneNumber: {
            type: ["string", "null"],
          },

          email: {
            type: ["string", "null"],
          },

          procedure: {
            type: ["string", "null"],
          },

          reason: {
            type: ["string", "null"],
          },

          dentist: {
            type: ["string", "null"],
          },

          insurance: {
            type: ["string", "null"],
          },

          preferredDate: {
            type: ["string", "null"],
          },

          preferredTime: {
            type: ["string", "null"],
          },

          confirmed: {
            type: ["boolean", "null"],
          },
        },

        required: [
          "patientName",
          "phoneNumber",
          "email",
          "procedure",
          "reason",
          "dentist",
          "insurance",
          "preferredDate",
          "preferredTime",
          "confirmed",
        ],
      },
    },

    required: [
  "message",
  "speech",
  "intent",
  "confidence",
  "shouldHangup",
  "actions",
  "analysis",
  "appointment",
],
  },
} as const;
