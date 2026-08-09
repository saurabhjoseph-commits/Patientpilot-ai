import { DemoSpeechPlayer } from "./speech";
import { DemoTonePlayer } from "./sounds";
import type { DemoAudioManager, DemoSpeaker } from "./types";

export class BrowserDemoAudioManager implements DemoAudioManager {
  private readonly tones = new DemoTonePlayer();
  private readonly speech = new DemoSpeechPlayer();
  private muted = false;

  playRingtone() { return !this.muted && this.tones.playRingtone(); }
  stopRingtone() { this.tones.stopRingtone(); }
  playConnectTone() { return !this.muted && this.tones.connect(); }
  speak(text: string, speaker: DemoSpeaker) { return !this.muted && this.speech.speak(text, speaker); }
  playCompletionTone() { return !this.muted && this.tones.complete(); }
  stopAll() { this.tones.stopRingtone(); this.speech.stop(); }
  setMuted(muted: boolean) { this.muted = muted; this.tones.setMuted(muted); this.speech.setMuted(muted); }
  dispose() { this.stopAll(); this.tones.close(); }
}

export function createDemoAudioManager() { return new BrowserDemoAudioManager(); }
