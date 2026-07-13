import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

export interface GatherSpeechOptions {
  action: string;
  timeout?: number;
  speechTimeout?: string | number;
  hints?: string;
}

/**
 * Create a new VoiceResponse.
 */
export function createVoiceResponse(): VoiceResponse {
  return new VoiceResponse();
}

/**
 * Standard greeting.
 */
export function buildGreetingResponse(): VoiceResponse {
  const twiml = createVoiceResponse();

  twiml.say(
    { voice: "alice" },
    "Hello. Thank you for calling Patient Pilot AI."
  );

  twiml.pause({ length: 1 });

  twiml.say(
    { voice: "alice" },
    "Our AI receptionist is ready to help you today."
  );

  return twiml;
}

/**
 * Gather speech from caller.
 */
export function buildSpeechGatherResponse(
  prompt: string,
  options: GatherSpeechOptions
): VoiceResponse {
  const twiml = createVoiceResponse();

  const gather = twiml.gather({
    input: ["speech"],

    action: options.action,

    method: "POST",

    timeout: options.timeout ?? 5,

    speechTimeout:
      options.speechTimeout !== undefined
        ? String(options.speechTimeout)
        : "auto",

    // Fixed language to avoid Twilio typing issues.
    language: "en-US",

    hints: options.hints,
  });

  gather.say(
    {
      voice: "alice",
    },
    prompt
  );

  return twiml;
}

/**
 * Say a message then hang up.
 */
export function buildHangupResponse(
  message = "Thank you for calling Patient Pilot AI. Goodbye."
): VoiceResponse {
  const twiml = createVoiceResponse();

  twiml.say(
    {
      voice: "alice",
    },
    message
  );

  twiml.hangup();

  return twiml;
}

/**
 * Redirect caller.
 */
export function buildRedirectResponse(
  url: string
): VoiceResponse {
  const twiml = createVoiceResponse();

  twiml.redirect(
    {
      method: "POST",
    },
    url
  );

  return twiml;
}

/**
 * Play audio.
 */
export function buildPlayAudioResponse(
  audioUrl: string
): VoiceResponse {
  const twiml = createVoiceResponse();

  twiml.play(audioUrl);

  return twiml;
}

/**
 * Waiting response.
 */
export function buildWaitingResponse(): VoiceResponse {
  const twiml = createVoiceResponse();

  twiml.say(
    {
      voice: "alice",
    },
    "Please hold while we connect your call."
  );

  twiml.pause({
    length: 2,
  });

  twiml.say(
    {
      voice: "alice",
    },
    "Thank you for your patience."
  );

  return twiml;
}