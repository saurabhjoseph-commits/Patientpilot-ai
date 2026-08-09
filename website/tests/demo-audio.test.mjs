import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("demo audio starts ringtone in the ringing stage and stops before connection", () => {
  const provider = read("components/demo/live/DemoProvider.tsx");
  assert.match(provider, /stage === "ringing"/);
  assert.match(provider, /playRingtone\(\)/);
  assert.match(provider, /audioRef\.current\?\.stopRingtone\(\)/);
  assert.match(provider, /stage === "connected"/);
  assert.match(provider, /playConnectTone\(\)/);
});

test("demo audio speaks revealed scenario AI and patient text", () => {
  const provider = read("components/demo/live/DemoProvider.tsx");
  const speech = read("lib/demo/audio/speech.ts");
  assert.match(provider, /currentMessage\.text/);
  assert.match(provider, /currentMessage\.speaker/);
  assert.match(provider, /currentMessage\.speaker === "system"/);
  assert.match(speech, /speaker === "ai"/);
  assert.match(speech, /patientVoice/);
  assert.match(speech, /speechSynthesis\.speak/);
});

test("completion, mute, resets, and scenario changes clean up demo audio", () => {
  const provider = read("components/demo/live/DemoProvider.tsx");
  const controls = read("components/demo/live/CallControls.tsx");
  assert.match(provider, /playCompletionTone\(\)/);
  assert.match(provider, /audioRef\.current\?\.stopAll\(\)/);
  assert.match(provider, /audioRef\.current\?\.dispose\(\)/);
  assert.match(provider, /setScenario/);
  assert.match(provider, /setMuted\(!next\)/);
  assert.match(controls, /Mute demo sound/);
  assert.match(controls, /Sound On/);
});

test("audio safely falls back without browser speech synthesis and stays demo-only", () => {
  const speech = read("lib/demo/audio/speech.ts");
  const manager = read("lib/demo/audio/demo-audio-manager.ts");
  const provider = read("components/demo/live/DemoProvider.tsx");
  assert.match(speech, /!window\.speechSynthesis/);
  assert.match(provider, /Sound is muted by your browser\. Tap Sound On\./);
  assert.match(manager, /BrowserDemoAudioManager/);
  assert.doesNotMatch(manager, /twilio|webhook|service-role/i);
});
