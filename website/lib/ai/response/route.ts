// website/app/api/ai/respond/route.ts

import { NextRequest, NextResponse } from "next/server";

import { continueConversation } from "@/lib/ai/service";

import type {
  AIContext,
  AIMessage,
} from "@/lib/ai/types";

/**
 * ============================================================
 * PatientPilot AI
 * AI Response Endpoint
 * ============================================================
 */

export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json();

    const {
      callId,
      message,
      intent = "unknown",
      context,
    } = body;

    if (!callId) {
      return NextResponse.json(
        {
          error: "Missing callId.",
        },
        {
          status: 400,
        },
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          error: "Missing message.",
        },
        {
          status: 400,
        },
      );
    }

    /**
     * Build conversation message.
     */
    const aiMessage: AIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      speaker: "patient",
      content: message,
      timestamp: new Date().toISOString(),
    };

    /**
     * Use supplied clinic context
     * or fallback demo values.
     */
    const aiContext: AIContext =
      context ?? {
        clinicName: "Bright Smile Dental",

        timezone: "America/New_York",

        officeHours:
          "Mon-Fri 8:00 AM - 5:00 PM",

        providers: [
          "Dr. Smith",
        ],

        acceptedInsurance: [
          "Delta Dental",
        ],

        appointmentTypes: [
          "Cleaning",
          "Emergency",
          "Consultation",
        ],
      };

    const response =
      await continueConversation({
        callId,
        context: aiContext,
        message: aiMessage,
        intent,
      });

    return NextResponse.json(response);

  } catch (error) {
    console.error(
      "AI response error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}