import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import { NextRequest, NextResponse } from "next/server";

import {
  startConversation,
} from "@/lib/ai";

import {
  executeConversationWorkflow,
} from "@/lib/workflows/conversation-workflow";
import { ClinicResolutionError, resolveTelephonyClinic } from "@/lib/clinic/clinic-scope";
import { verifyTwilioWebhook } from "@/lib/telephony/twilio-webhook-security";
import { getWebhookDeliveryExpiry } from "@/lib/telephony/twilio-webhook-security";
import { createWebhookDeliveryService } from "@/lib/telephony/webhook-delivery-service";

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
  let deliveryId: string | undefined;
  try {
    const verification = await verifyTwilioWebhook(req);
    if (!verification.ok) {
      return NextResponse.json({ error: "Unauthorized webhook." }, { status: verification.status });
    }
    const deliveries = createWebhookDeliveryService();
    const receivedAt = new Date();
    const claim = await deliveries.claim({
      provider: "twilio",
      fingerprint: verification.fingerprint,
      route: req.nextUrl.pathname,
      callSid: verification.callSid,
      receivedAt,
      expiresAt: getWebhookDeliveryExpiry(receivedAt),
    });
    if (!claim.claimed) return emptyTwimlResponse();
    if (!claim.deliveryId) throw new Error("Webhook delivery claim did not return an identifier.");
    deliveryId = claim.deliveryId;

    const { formData } = verification;

    const callSid = String(formData.get("CallSid") ?? "");

    const speechResult = String(
      formData.get("SpeechResult") ?? ""
    ).trim();

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

    const scope = resolveTelephonyClinic(String(formData.get("To") ?? ""));

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

      await deliveries.markCompleted(deliveryId);
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
    speechResult,
    scope,
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

      await deliveries.markCompleted(deliveryId);
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

    await deliveries.markCompleted(deliveryId);
    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    if (deliveryId) {
      try {
        await createWebhookDeliveryService().markFailed(deliveryId, "ai_response_processing_failed");
      } catch {
        console.error("Twilio AI response webhook failure could not be recorded.");
      }
    }
    if (error instanceof ClinicResolutionError) {
      return NextResponse.json({ error: "Clinic routing is unavailable." }, { status: 503 });
    }
    console.error("Twilio AI response webhook failed.");

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
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({
    service: "PatientPilot AI",
    endpoint: "/api/ai/respond",
    status: "online",
    timestamp: new Date().toISOString(),
  });
}

function emptyTwimlResponse(): NextResponse {
  return new NextResponse("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>", {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
