export type DemoSpeaker = "ai" | "patient";

export interface DemoAudioManager {
  playRingtone(): boolean;
  stopRingtone(): void;
  playConnectTone(): boolean;
  speak(text: string, speaker: DemoSpeaker): Promise<boolean>;
  playCompletionTone(): boolean;
  stopAll(): void;
  setMuted(muted: boolean): void;
}
