import type { ClinicLanguageMode, ConversationLanguage } from "@/lib/platform/domain/clinic-language";

export const MAX_RECOGNITION_FAILURES = 2;

export type TwilioSpeechLocale = "en-IN" | "hi-IN" | "en-US";
export type TwilioReceptionistVoice = "Polly.Kajal-Neural" | "Polly.Joanna-Neural";

export interface VoiceProfile {
  readonly language: TwilioSpeechLocale;
  readonly voice: TwilioReceptionistVoice;
}

export function selectVoiceProfile(
  language: ConversationLanguage,
  mode: ClinicLanguageMode,
  country?: string,
): VoiceProfile {
  const isIndia = country?.trim().toLowerCase() === "india" || mode !== "english";
  if (language === "hindi" || language === "hinglish" || mode === "hindi") {
    return { language: "hi-IN", voice: "Polly.Kajal-Neural" };
  }
  if (isIndia) return { language: "en-IN", voice: "Polly.Kajal-Neural" };
  return { language: "en-US", voice: "Polly.Joanna-Neural" };
}

export function noInputPrompt(language: ConversationLanguage, finalAttempt: boolean): string {
  if (language === "hindi" || language === "hinglish") {
    return finalAttempt
      ? "Maaf kijiye, main aapki baat samajh nahi pa rahi hoon. Main clinic team se connect karne ki koshish karti hoon."
      : "Maaf kijiye, mujhe awaaz saaf nahi mili. Kripya ek baar phir boliye."
  }
  return finalAttempt
    ? "I’m sorry, I still couldn’t hear you clearly. I’ll try to connect you with the clinic team."
    : "I’m sorry, I didn’t hear that clearly. Please say it once more."
}

export function continuationPrompt(language: ConversationLanguage): string {
  return language === "hindi" || language === "hinglish" ? "Ji, bataiye." : "Please go ahead.";
}

export function goodbyePrompt(language: ConversationLanguage): string {
  return language === "hindi" || language === "hinglish"
    ? "Patient Pilot AI ko call karne ke liye dhanyavaad. Namaste."
    : "Thank you for calling Patient Pilot AI. Goodbye.";
}

export function isUsableSpeechRecognition(text: string, confidence?: number): boolean {
  if (!text.trim()) return false;
  return confidence === undefined || !Number.isFinite(confidence) || confidence >= 0.15;
}

export function resolveHandoffNumber(clinicId: string, value = process.env.TELEPHONY_HANDOFF_PHONE_MAP): string | undefined {
  if (!value) return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
    const candidate = (parsed as Record<string, unknown>)[clinicId];
    return typeof candidate === "string" && /^\+[1-9]\d{7,14}$/.test(candidate) ? candidate : undefined;
  } catch {
    return undefined;
  }
}
