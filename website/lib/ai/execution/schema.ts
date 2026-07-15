// website/lib/ai/execution/schema.ts

/**
 * ============================================================
 * PatientPilot AI
 * RC5 Execution Engine
 * Structured Response Schema
 * ============================================================
 *
 * This schema defines the ONLY valid response
 * the AI may return.
 */

export const conversationResponseSchema = {
  name: "patientpilot_ai_response",

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
        minimum: 0,
        maximum: 1,
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

            enum: [
              "idle",
              "greeting",
              "collecting_name",
              "collecting_phone",
              "collecting_reason",
              "collecting_date",
              "confirming",
              "completed",
              "handoff",
              "ended",
            ],
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
            minimum: 0,
            maximum: 1,
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
        type: "object",

        additionalProperties: false,

        properties: {
          patientName: {
            type: "string",
          },

          phoneNumber: {
            type: "string",
          },

          email: {
            type: "string",
          },

          procedure: {
            type: "string",
          },

          reason: {
            type: "string",
          },

          dentist: {
            type: "string",
          },

          insurance: {
            type: "string",
          },

          preferredDate: {
            type: "string",
          },

          preferredTime: {
            type: "string",
          },

          confirmed: {
            type: "boolean",
          },
        },
      },
    },

    required: [
      "message",
      "speech",
      "intent",
      "confidence",
      "analysis",
      "actions",
      "shouldHangup",
    ],
  },
} as const;