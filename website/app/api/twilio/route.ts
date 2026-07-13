import { NextRequest, NextResponse } from "next/server";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const callSid = String(formData.get("CallSid") ?? "");
    const from = String(formData.get("From") ?? "");
    const to = String(formData.get("To") ?? "");
    const callStatus = String(formData.get("CallStatus") ?? "");
    const direction = String(formData.get("Direction") ?? "");
    const accountSid = String(formData.get("AccountSid") ?? "");

    console.log("======================================");
    console.log("📞 Incoming Twilio Call");
    console.log("======================================");
    console.log({
      accountSid,
      callSid,
      from,
      to,
      callStatus,
      direction,
      receivedAt: new Date().toISOString(),
    });
    console.log("======================================");

    const twiml = new VoiceResponse();

    twiml.say(
      {
        voice: "alice",
      },
      "Hello. Thank you for calling Patient Pilot AI."
    );

    twiml.pause({
      length: 1,
    });

    twiml.say(
      {
        voice: "alice",
      },
      "Our AI receptionist is currently being connected. Please stay on the line."
    );

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("❌ Twilio Voice Webhook Error:", error);

    const twiml = new VoiceResponse();

    twiml.say(
      {
        voice: "alice",
      },
      "We are sorry. An unexpected error occurred. Please try your call again later."
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