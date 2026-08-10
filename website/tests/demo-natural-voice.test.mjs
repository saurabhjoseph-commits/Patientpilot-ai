import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("demo speech resolves only after utterance end or safe fallback", () => {
  const speech = read("lib/demo/audio/speech.ts");
  assert.match(speech, /async speak\(text: string, speaker: DemoSpeaker\): Promise<boolean>/);
  assert.match(speech, /utterance\.onend = \(\) => finish\(true\)/);
  assert.match(speech, /utterance\.onerror = \(\) => finish\(false\)/);
  assert.match(speech, /SPEECH_TIMEOUT_MS/);
});

test("turn sequencing awaits speech completion before revealing the next message", () => {
  const provider = read("components/demo/live/DemoProvider.tsx");
  assert.match(provider, /const spoken = await audio\(\)\.speak/);
  assert.match(provider, /await wait\(isLast \? 500 : pauseFor/);
  assert.match(provider, /nextMessage\(\);/);
  assert.doesNotMatch(provider, /setTimeout\(\(\) => \{\s*nextMessage\(\)/);
});

test("voice selection waits for delayed voices and prefers high-quality English voices", () => {
  const speech = read("lib/demo/audio/speech.ts");
  assert.match(speech, /waitForVoices/);
  assert.match(speech, /voiceschanged/);
  assert.match(speech, /VOICE_WAIT_MS/);
  assert.match(speech, /microsoft/);
  assert.match(speech, /google/);
  assert.match(speech, /samantha/);
  assert.match(speech, /selectVoices/);
});

test("AI and patient voice settings are conservative and distinct where possible", () => {
  const speech = read("lib/demo/audio/speech.ts");
  assert.match(speech, /speaker === "ai" \? 0\.9 : 0\.94/);
  assert.match(speech, /speaker === "ai" \? 1 : 0\.97/);
  assert.match(speech, /patientVoice/);
});

test("speech avoids overlap, chunks long lines, and resets safely", () => {
  const speech = read("lib/demo/audio/speech.ts");
  const provider = read("components/demo/live/DemoProvider.tsx");
  assert.match(speech, /for \(const \[index, chunk\] of chunks\.entries\(\)\)/);
  assert.match(speech, /speechChunks/);
  assert.match(speech, /window\.speechSynthesis\.cancel\(\)/);
  assert.match(provider, /audioRef\.current\?\.stopAll\(\)/);
  assert.match(speech, /!window\.speechSynthesis/);
});
