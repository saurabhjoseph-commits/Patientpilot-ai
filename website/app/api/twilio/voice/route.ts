import { NextRequest, NextResponse } from "next/server";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

import { startConversation } from "@/lib/ai";
import { TWILIO_WEBHOOKS } from "@/lib/config/app";

import {
  addEvent,
  createLiveCall,
  getLiveCall,
  updateAIState,
  updateCallStatus,
} from "@/lib/live";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const callSid = String(formData.get("CallSid") ?? "");
    const from = String(formData.get("From") ?? "");
    const to = String(formData.get("To") ?? "");

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

    console.log("========================================");
    console.log("📞 Incoming Call");
    console.log("========================================");
    console.log({
      callSid,
      from,
      to,
      timestamp: new Date().toISOString(),
    });
    console.log("========================================");

    /**
     * ----------------------------------------
     * AI Conversation
     * ----------------------------------------
     */
    startConversation(callSid);

    /**
     * ----------------------------------------
     * Live Monitor
     * ----------------------------------------
     */
    if (!getLiveCall(callSid)) {
      createLiveCall(callSid, from, to);
    }

    updateCallStatus(callSid, "connected");

    updateAIState(callSid, "greeting");

    addEvent(callSid, {
      type: "incoming",
      title: "Incoming Call",
      description: `Call received from ${from}`,
    });

    addEvent(callSid, {
      type: "connected",
      title: "AI Connected",
      description: "PatientPilot AI answered the call.",
    });

    const twiml = new VoiceResponse();

    const gather = twiml.gather({
      input: ["speech"],

      action: TWILIO_WEBHOOKS.aiRespond,

      method: "POST",

      language: "en-US",

      speechTimeout: "auto",

      timeout: 5,
    });

    gather.say(
      {
        voice: "alice",
      },
      "Hello. Thank you for calling Patient Pilot AI. How may I help you today?"
    );

    /**
     * If caller remains silent.
     */
    twiml.say(
      {
        voice: "alice",
      },
      "I didn't hear a response. Please call again if you need assistance. Goodbye."
    );

    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error(
      "❌ Twilio Voice Webhook Error:",
      error
    );

    const twiml = new VoiceResponse();

    twiml.say(
      {
        voice: "alice",
      },
      "We're sorry. An unexpected error occurred. Please try again later."
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
    service: "PatientPilot AI Voice Webhook",
    status: "online",
    endpoint: "/api/twilio/voice",
    timestamp: new Date().toISOString(),
  });
}