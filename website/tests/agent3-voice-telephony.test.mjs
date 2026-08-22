import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

function loadTypeScriptModule(path) {
  const compiled = ts.transpileModule(read(path), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loadedModule = { exports: {} };
  Function("module", "exports", "process", compiled)(loadedModule, loadedModule.exports, process);
  return loadedModule.exports;
}

const voice = loadTypeScriptModule("lib/telephony/voice-policy.ts");
const language = loadTypeScriptModule("lib/platform/domain/clinic-language.ts");

test("English, Hindi, and Hinglish turns select explicit Indian STT and neural TTS", () => {
  assert.deepEqual(voice.selectVoiceProfile("english", "bilingual-auto", "India"), { language: "en-IN", voice: "Polly.Kajal-Neural" });
  assert.deepEqual(voice.selectVoiceProfile("hindi", "bilingual-auto", "India"), { language: "hi-IN", voice: "Polly.Kajal-Neural" });
  assert.deepEqual(voice.selectVoiceProfile("hinglish", "bilingual-auto", "India"), { language: "hi-IN", voice: "Polly.Kajal-Neural" });
});

test("per-turn profile follows Agent 2 language switching without resetting conversation state", () => {
  let state = language.createConversationLanguageState("bilingual-auto");
  state = language.updateConversationLanguageState(state, language.detectConversationLanguage("I need an appointment"));
  assert.equal(voice.selectVoiceProfile(state.currentPatientLanguage, state.configuredMode, "India").language, "en-IN");
  state = language.updateConversationLanguageState(state, language.detectConversationLanguage("मुझे शाम पांच बजे चाहिए"));
  assert.equal(voice.selectVoiceProfile(state.currentPatientLanguage, state.configuredMode, "India").language, "hi-IN");
  assert.equal(state.codeSwitchingOccurred, true);
});

test("silence and low-confidence recognition fail safely while a usable turn resets retry flow", () => {
  assert.equal(voice.isUsableSpeechRecognition("", undefined), false);
  assert.equal(voice.isUsableSpeechRecognition("unclear", 0.05), false);
  assert.equal(voice.isUsableSpeechRecognition("Mujhe appointment chahiye", 0.8), true);
  assert.equal(voice.MAX_RECOGNITION_FAILURES, 2);
});

test("voice routes request empty-result callbacks and persist bounded retries", () => {
  const incoming = read("app/api/twilio/voice/route.ts");
  const respond = read("app/api/ai/respond/route.ts");
  const session = read("lib/ai/session.ts");
  assert.match(incoming, /actionOnEmptyResult: true/);
  assert.match(respond, /actionOnEmptyResult: true/);
  assert.match(respond, /recordRecognitionFailure/);
  assert.match(respond, /resetRecognitionFailures/);
  assert.match(session, /recognitionFailureCount \+= 1/);
});

test("handoff numbers are server-configured, clinic keyed, and E.164 validated", () => {
  const clinicId = "00000000-0000-4000-8000-000000000000";
  assert.equal(voice.resolveHandoffNumber(clinicId, JSON.stringify({ [clinicId]: "+919876543210" })), "+919876543210");
  assert.equal(voice.resolveHandoffNumber(clinicId, JSON.stringify({ [clinicId]: "9876543210" })), undefined);
  assert.equal(voice.resolveHandoffNumber(clinicId, "malformed"), undefined);
  assert.match(read("app/api/ai/respond/route.ts"), /twiml\.dial\(\{ answerOnBridge: true, timeout: 20 \}/);
});

test("emergency escalation gives urgent-care guidance and uses the existing handoff decision", () => {
  const respond = read("app/api/ai/respond/route.ts");
  const rules = read("lib/ai/decision/rules.ts");
  assert.match(rules, /emergency:[\s\S]*requiresHuman: true/);
  assert.match(respond, /uncontrolled bleeding, severe swelling, trouble breathing/);
  assert.match(respond, /result\.analysis\.needsHuman/);
});

test("malformed webhooks fail before clinic routing and routing remains destination-derived", () => {
  for (const path of ["app/api/twilio/voice/route.ts", "app/api/ai/respond/route.ts"]) {
    const route = read(path);
    assert.ok(route.indexOf("const verification = await verifyTwilioWebhook") < route.indexOf("const scope = resolveTelephonyClinic"));
  }
  const security = read("lib/telephony/twilio-webhook-security.ts");
  const scope = read("lib/clinic/clinic-scope.ts");
  assert.match(security, /validateRequest\(authToken, signature, url, params\)/);
  assert.match(scope, /TELEPHONY_CLINIC_PHONE_MAP/);
  assert.match(scope, /No trusted telephony clinic mapping/);
});

test("terminal Twilio status completes only the verified clinic-scoped conversation", () => {
  const status = read("app/api/twilio/status/route.ts");
  assert.ok(status.indexOf("resolveCallOwnership(scope, callSid)") < status.indexOf("markCompleted(scope.clinicId, callSid)"));
  assert.match(status, /"completed", "busy", "failed", "no-answer", "canceled"/);
});

test("response turns reuse preloaded clinic context to avoid duplicate latency-sensitive queries", () => {
  const route = read("app/api/ai/respond/route.ts");
  const workflow = read("lib/workflows/conversation-workflow.ts");
  assert.match(route, /scope,\s*receptionistContext,/);
  assert.match(workflow, /suppliedContext \?\? await getClinicReceptionistContext/);
});
