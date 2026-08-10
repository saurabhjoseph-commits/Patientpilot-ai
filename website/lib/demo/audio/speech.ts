import type { DemoSpeaker } from "./types";

const VOICE_WAIT_MS = 450;
const SPEECH_TIMEOUT_MS = 18_000;

export class DemoSpeechPlayer {
  private muted = false;
  private activeResolve: ((completed: boolean) => void) | null = null;
  private activeTimeout: number | null = null;
  private stopped = false;

  setMuted(muted: boolean) { this.muted = muted; if (muted) this.stop(); }

  stop() {
    this.stopped = true;
    if (this.activeTimeout !== null) window.clearTimeout(this.activeTimeout);
    this.activeTimeout = null;
    const resolve = this.activeResolve;
    this.activeResolve = null;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    resolve?.(false);
  }

  async speak(text: string, speaker: DemoSpeaker): Promise<boolean> {
    if (typeof window === "undefined" || this.muted || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return false;
    this.stopped = false;
    const voices = await waitForVoices();
    const chunks = speechChunks(text);
    for (const [index, chunk] of chunks.entries()) {
      if (this.stopped || this.muted) return false;
      const completed = await this.speakChunk(chunk, speaker, voices);
      if (!completed) return false;
      if (index < chunks.length - 1) await pause(180);
    }
    return !this.stopped;
  }

  private speakChunk(text: string, speaker: DemoSpeaker, voices: SpeechSynthesisVoice[]): Promise<boolean> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const [aiVoice, patientVoice] = selectVoices(voices);
      utterance.voice = speaker === "ai" ? aiVoice ?? null : patientVoice ?? aiVoice ?? null;
      utterance.lang = utterance.voice?.lang ?? "en-US";
      utterance.rate = speaker === "ai" ? 0.9 : 0.94;
      utterance.pitch = speaker === "ai" ? 1 : 0.97;
      utterance.volume = 1;
      const finish = (completed: boolean) => {
        if (this.activeTimeout !== null) window.clearTimeout(this.activeTimeout);
        this.activeTimeout = null;
        this.activeResolve = null;
        resolve(completed && !this.stopped);
      };
      this.activeResolve = finish;
      utterance.onend = () => finish(true);
      utterance.onerror = () => finish(false);
      this.activeTimeout = window.setTimeout(() => { window.speechSynthesis.cancel(); finish(false); }, SPEECH_TIMEOUT_MS);
      window.speechSynthesis.speak(utterance);
    });
  }
}

export async function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const current = window.speechSynthesis.getVoices();
  if (current.length) return current;
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => { window.speechSynthesis.removeEventListener("voiceschanged", loaded); resolve(window.speechSynthesis.getVoices()); }, VOICE_WAIT_MS);
    const loaded = () => { window.clearTimeout(timer); window.speechSynthesis.removeEventListener("voiceschanged", loaded); resolve(window.speechSynthesis.getVoices()); };
    window.speechSynthesis.addEventListener("voiceschanged", loaded, { once: true });
  });
}

export function selectVoices(voices: SpeechSynthesisVoice[]): [SpeechSynthesisVoice | undefined, SpeechSynthesisVoice | undefined] {
  const english = voices.filter((voice) => /^en(-|_)/i.test(voice.lang));
  const ranked = [...english].sort((left, right) => voiceScore(right) - voiceScore(left));
  const ai = ranked[0];
  return [ai, ranked.find((voice) => voice.voiceURI !== ai?.voiceURI) ?? ai];
}

export function speechChunks(text: string): string[] {
  const normalized = text.replace(/[•▪]/g, ", ").replace(/\s+/g, " ").trim();
  const sentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [normalized];
  return sentences.flatMap((sentence) => sentence.trim().match(/.{1,170}(?:\s|$)|.{1,170}/g) ?? []).map((chunk) => chunk.trim()).filter(Boolean);
}

function voiceScore(voice: SpeechSynthesisVoice) { const name = `${voice.name} ${voice.voiceURI}`.toLowerCase(); return (name.includes("microsoft") ? 50 : 0) + (name.includes("natural") ? 40 : 0) + (name.includes("google") ? 35 : 0) + (name.includes("samantha") ? 30 : 0) + (voice.lang === "en-US" ? 15 : 0) + (voice.lang === "en-GB" || voice.lang === "en-IN" ? 10 : 0) + (voice.localService ? 3 : 0); }
function pause(milliseconds: number) { return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds)); }
