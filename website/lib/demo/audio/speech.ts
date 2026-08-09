import type { DemoSpeaker } from "./types";

export class DemoSpeechPlayer {
  private muted = false;

  setMuted(muted: boolean) { this.muted = muted; if (muted) this.stop(); }
  stop() { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }

  speak(text: string, speaker: DemoSpeaker): boolean {
    if (typeof window === "undefined" || this.muted || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return false;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith("en"));
    const aiVoice = voices[0];
    const patientVoice = voices.find((voice) => voice.voiceURI !== aiVoice?.voiceURI) ?? aiVoice;
    utterance.voice = speaker === "ai" ? aiVoice ?? null : patientVoice ?? null;
    utterance.lang = utterance.voice?.lang ?? "en-US";
    utterance.rate = speaker === "ai" ? 0.96 : 0.9;
    utterance.pitch = speaker === "ai" ? 1 : 1.08;
    utterance.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  }
}
