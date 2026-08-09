type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

export class DemoTonePlayer {
  private context: AudioContext | null = null;
  private ringtoneTimer: number | null = null;
  private ringtoneNodes: OscillatorNode[] = [];
  private muted = false;

  setMuted(muted: boolean) { this.muted = muted; if (muted) this.stopRingtone(); }

  playRingtone(): boolean {
    if (this.muted || !this.ensureContext()) return false;
    this.stopRingtone();
    const ring = () => {
      this.ringtoneNodes = [this.tone(440, 0.16, 0), this.tone(480, 0.16, 0.2)].filter((node): node is OscillatorNode => Boolean(node));
    };
    ring();
    this.ringtoneTimer = window.setInterval(ring, 1000);
    return true;
  }

  stopRingtone() {
    if (this.ringtoneTimer !== null) window.clearInterval(this.ringtoneTimer);
    this.ringtoneTimer = null;
    this.ringtoneNodes.forEach((node) => { try { node.stop(); } catch {} });
    this.ringtoneNodes = [];
  }

  connect(): boolean { return Boolean(this.tone(660, 0.1) && this.tone(880, 0.1, 0.12)); }
  complete(): boolean { return Boolean(this.tone(520, 0.12) && this.tone(390, 0.2, 0.15)); }
  close() { this.stopRingtone(); this.context?.close().catch(() => undefined); this.context = null; }

  private ensureContext() {
    if (typeof window === "undefined" || this.muted) return false;
    const AudioContextClass = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!AudioContextClass) return false;
    this.context ??= new AudioContextClass();
    void this.context.resume().catch(() => undefined);
    return true;
  }

  private tone(frequency: number, duration: number, offset = 0): OscillatorNode | null {
    if (!this.ensureContext() || !this.context) return null;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const start = this.context.currentTime + offset;
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
    return oscillator;
  }
}
