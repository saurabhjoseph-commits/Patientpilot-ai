export type ClinicLanguageCode = "en" | "hi";
export type ClinicLanguageMode = "english" | "hindi" | "bilingual-auto";
export type ConversationLanguage = "english" | "hindi" | "hinglish" | "unknown";

export interface ConversationLanguageState {
  configuredMode: ClinicLanguageMode;
  currentPatientLanguage: ConversationLanguage;
  detectedPrimaryLanguage: ConversationLanguage;
  confidence?: number;
  codeSwitchingOccurred: boolean;
}

export interface LanguageDetection { language: ConversationLanguage; confidence: number; }

const DEVANAGARI = /[\u0900-\u097f]/g;
const LATIN_WORD = /[a-z]+/gi;
const HINGLISH_WORDS = new Set(["aaj", "abhi", "baje", "bahut", "chahiye", "daant", "hai", "hain", "ho", "kar", "karna", "karwani", "kal", "kab", "kya", "mein", "mera", "mere", "mujhe", "nahi", "sakte", "subah", "shaam"]);
const ENGLISH_SIGNALS = new Set(["actually", "appointment", "available", "book", "can", "cancel", "cleaning", "cost", "doctor", "evening", "hours", "insurance", "make", "morning", "need", "pain", "please", "price", "reschedule", "tomorrow", "want", "what", "when"]);

export function defaultClinicLanguageMode(country?: string): ClinicLanguageMode {
  return country?.trim().toLowerCase() === "india" ? "bilingual-auto" : "english";
}

export function normalizeClinicLanguageMode(value?: string, country?: string): ClinicLanguageMode {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "bilingual-auto") return "bilingual-auto";
  if (normalized === "hi" || normalized === "hi-in" || normalized === "hindi") return "hindi";
  if (normalized === "en" || normalized === "en-us" || normalized === "en-in" || normalized === "english") return "english";
  return defaultClinicLanguageMode(country);
}

export function createConversationLanguageState(configuredMode: ClinicLanguageMode): ConversationLanguageState {
  const fixed = configuredMode === "english" ? "english" : configuredMode === "hindi" ? "hindi" : "unknown";
  return { configuredMode, currentPatientLanguage: fixed, detectedPrimaryLanguage: fixed, confidence: fixed === "unknown" ? undefined : 1, codeSwitchingOccurred: false };
}

export function detectConversationLanguage(text: string): LanguageDetection {
  const devanagariCount = text.match(DEVANAGARI)?.length ?? 0;
  const words = text.toLowerCase().match(LATIN_WORD) ?? [];
  const hinglishCount = words.filter((word) => HINGLISH_WORDS.has(word)).length;
  const englishCount = words.filter((word) => ENGLISH_SIGNALS.has(word)).length;
  if (devanagariCount > 0) {
    const latinSignal = hinglishCount + englishCount;
    return latinSignal > 0 ? { language: "hinglish", confidence: Math.min(0.98, 0.72 + latinSignal * 0.04) } : { language: "hindi", confidence: Math.min(0.99, 0.82 + devanagariCount * 0.005) };
  }
  if (hinglishCount >= 2 && hinglishCount >= englishCount) return { language: "hinglish", confidence: Math.min(0.96, 0.68 + hinglishCount * 0.05) };
  if (englishCount > 0 || words.length >= 2) return { language: "english", confidence: Math.min(0.96, 0.7 + englishCount * 0.04) };
  return { language: "unknown", confidence: 0 };
}

export function updateConversationLanguageState(current: ConversationLanguageState, detection: LanguageDetection): ConversationLanguageState {
  if (current.configuredMode !== "bilingual-auto" || detection.language === "unknown") return current;
  const switched = current.currentPatientLanguage !== "unknown" && current.currentPatientLanguage !== detection.language;
  return { ...current, currentPatientLanguage: detection.language, detectedPrimaryLanguage: current.detectedPrimaryLanguage === "unknown" ? detection.language : current.detectedPrimaryLanguage, confidence: detection.confidence, codeSwitchingOccurred: current.codeSwitchingOccurred || switched };
}

export function speechRecognitionLocale(language: ConversationLanguage, mode: ClinicLanguageMode, country?: string): "hi-IN" | "en-IN" | "en-US" {
  if (language === "hindi" || language === "hinglish" || mode === "hindi") return "hi-IN";
  return country?.trim().toLowerCase() === "india" || mode === "bilingual-auto" ? "en-IN" : "en-US";
}
