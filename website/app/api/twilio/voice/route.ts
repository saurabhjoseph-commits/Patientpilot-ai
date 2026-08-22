import { NextRequest, NextResponse } from "next/server";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

import { startConversation, updatePatient } from "@/lib/ai";
import { ClinicResolutionError, resolveTelephonyClinic } from "@/lib/clinic/clinic-scope";
import { getTwilioWebhooks } from "@/lib/config/app";
import { verifyTwilioWebhook } from "@/lib/telephony/twilio-webhook-security";
import { createWebhookDeliveryService } from "@/lib/telephony/webhook-delivery-service";
import { getWebhookDeliveryExpiry } from "@/lib/telephony/twilio-webhook-security";
import { ensureTelephonyCall } from "@/lib/calls/ownership";
import { getClinicReceptionistContext } from "@/lib/ai/clinic-receptionist-context";
import { selectVoiceProfile } from "@/lib/telephony/voice-policy";

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
  let deliveryId: string | undefined;
  try {
    const verification = await verifyTwilioWebhook(request);
    if (!verification.ok) {
      return NextResponse.json({ error: "Unauthorized webhook." }, { status: verification.status });
    }
    const deliveries = createWebhookDeliveryService();
    const receivedAt = new Date();
    const claim = await deliveries.claim({
      provider: "twilio",
      fingerprint: verification.fingerprint,
      route: request.nextUrl.pathname,
      callSid: verification.callSid,
      receivedAt,
      expiresAt: getWebhookDeliveryExpiry(receivedAt),
    });
    if (!claim.claimed) return emptyTwimlResponse();
    if (!claim.deliveryId) throw new Error("Webhook delivery claim did not return an identifier.");
    deliveryId = claim.deliveryId;

    const { formData } = verification;

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

    const scope = resolveTelephonyClinic(to);
    await ensureTelephonyCall(scope, { callSid, phone: from });
    const receptionistContext = await getClinicReceptionistContext(scope.clinicId);

    /**
     * ----------------------------------------
     * AI Conversation
     * ----------------------------------------
     */
    const session = await startConversation(scope.clinicId, callSid, receptionistContext.languageMode);
    await updatePatient(scope.clinicId, callSid, { phone: from });

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
    const voiceProfile = selectVoiceProfile(session.language.currentPatientLanguage, session.language.configuredMode, receptionistContext.country);

    const gather = twiml.gather({
      input: ["speech"],

      actionOnEmptyResult: true,

      action: getTwilioWebhooks().aiRespond,

      method: "POST",

      language: voiceProfile.language,

      speechTimeout: "auto",

      timeout: 5,
    });

    gather.say(
      {
        voice: voiceProfile.voice,
        language: voiceProfile.language,
      },
      receptionistContext.languageMode === "bilingual-auto"
        ? `Hello, thank you for calling ${receptionistContext.clinicName}. Namaste. How can I help you today?`
        : receptionistContext.languageMode === "hindi"
          ? `Namaste. ${receptionistContext.clinicName} mein aapka swagat hai. Main aapki kya madad kar sakti hoon?`
          : `Hello. Thank you for calling ${receptionistContext.clinicName}. How may I help you today?`
    );

    /**
     * If caller remains silent.
     */
    twiml.say(
      {
        voice: voiceProfile.voice,
        language: voiceProfile.language,
      },
      "I didn't hear a response. Please call again if you need assistance. Goodbye."
    );

    twiml.hangup();

    await deliveries.markCompleted(deliveryId);
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    if (deliveryId) {
      try {
        await createWebhookDeliveryService().markFailed(deliveryId, "voice_processing_failed");
      } catch {
        console.error("Twilio voice webhook failure could not be recorded.");
      }
    }
    if (error instanceof ClinicResolutionError) {
      return NextResponse.json({ error: "Clinic routing is unavailable." }, { status: 403 });
    }
    console.error("Twilio voice webhook failed.");

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
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({
    service: "PatientPilot AI Voice Webhook",
    status: "online",
    endpoint: "/api/twilio/voice",
    timestamp: new Date().toISOString(),
  });
}

function emptyTwimlResponse(): NextResponse {
  return new NextResponse("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>", {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
