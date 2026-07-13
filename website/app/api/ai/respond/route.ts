import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { NextRequest, NextResponse } from "next/server";

import {
  startConversation,
} from "@/lib/ai";

import {
  executeConversationWorkflow,
} from "@/lib/workflows/conversation-workflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Twilio Speech Webhook
 *
 * Twilio sends:
 * - CallSid
 * - SpeechResult
 * - Confidence
 *
 * We:
 * - Continue the AI conversation
 * - Return TwiML
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const callSid = String(formData.get("CallSid") ?? "");

    const speechResult = String(
      formData.get("SpeechResult") ?? ""
    ).trim();

    const confidence = String(
      formData.get("Confidence") ?? ""
    );

    console.log("==================================");
    console.log("🦷 PatientPilot AI");
    console.log("==================================");
    console.log({
      callSid,
      speechResult,
      confidence,
    });
    console.log("==================================");

    if (!callSid) {
      return NextResponse.json(
        {
          error: "Missing CallSid",
        },
        {
          status: 400,
        }
      );
    }

    // Ensure a session exists.
    startConversation(callSid);

    const twiml = new VoiceResponse();

    /**
     * Nothing recognized.
     */
    if (!speechResult) {
      const gather = twiml.gather({
        input: ["speech"],
        speechTimeout: "auto",
        timeout: 5,
        language: "en-US",
        method: "POST",
        action: "/api/ai/respond",
      });

      gather.say(
        {
          voice: "alice",
        },
        "I'm sorry, I didn't hear anything. Could you please repeat that?"
      );

      return new NextResponse(twiml.toString(), {
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    /**
 * Execute the complete business workflow.
 */
const workflow =
  await executeConversationWorkflow(
    callSid,
    speechResult
  );

const result = workflow.ai;

twiml.say(
  {
    voice: "alice",
  },
  result.response.message
);

/**
 * Log completed business workflow.
 */
if (workflow.appointment) {
  console.log(
    "✅ Appointment Created:",
    workflow.appointment.id
  );
}

if (workflow.patient) {
  console.log(
    "✅ Patient Synced:",
    workflow.patient.id
  );
}

if (workflow.summary) {
  console.log(
    "✅ Summary Saved:",
    workflow.summary.id
  );
}

    /**
     * Conversation finished.
     */
    if (result.response.shouldHangup) {
      twiml.say(
        {
          voice: "alice",
        },
        "Thank you for calling Patient Pilot AI. Goodbye."
      );

      twiml.hangup();

      return new NextResponse(twiml.toString(), {
        headers: {
          "Content-Type": "text/xml",
        },
      });
    }

    /**
     * Continue listening.
     */
    const gather = twiml.gather({
      input: ["speech"],
      speechTimeout: "auto",
      timeout: 5,
      language: "en-US",
      method: "POST",
      action: "/api/ai/respond",
    });

    gather.say(
      {
        voice: "alice",
      },
      "Please go ahead."
    );

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error(
      "❌ AI Respond Route Error:",
      error
    );

    const twiml = new VoiceResponse();

    twiml.say(
      {
        voice: "alice",
      },
      "We're sorry. An unexpected error occurred."
    );

    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      status: 500,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "PatientPilot AI",
    endpoint: "/api/ai/respond",
    status: "online",
    timestamp: new Date().toISOString(),
  });
}