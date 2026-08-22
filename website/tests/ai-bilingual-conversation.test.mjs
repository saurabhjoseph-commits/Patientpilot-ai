import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

function loadTypeScriptModule(path) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loadedModule = { exports: {} };
  Function("module", "exports", compiled)(loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const language = loadTypeScriptModule("lib/platform/domain/clinic-language.ts");
const intents = loadTypeScriptModule("lib/ai/intent-classifier.ts");
const extraction = loadTypeScriptModule("lib/ai/extractor.ts");

test("country defaults preserve India bilingual and USA English behavior", () => {
  assert.equal(language.defaultClinicLanguageMode("India"), "bilingual-auto");
  assert.equal(language.defaultClinicLanguageMode("United States"), "english");
  assert.equal(language.normalizeClinicLanguageMode("en-US", "India"), "english");
});

test("detects English, Hindi, and Hinglish booking utterances", () => {
  assert.equal(language.detectConversationLanguage("I need a cleaning appointment tomorrow").language, "english");
  assert.equal(language.detectConversationLanguage("मुझे कल दांत की सफाई के लिए अपॉइंटमेंट चाहिए").language, "hindi");
  assert.equal(language.detectConversationLanguage("Mujhe kal dentist ka appointment chahiye").language, "hinglish");
});

test("language persists and records English to Hindi switching", () => {
  let state = language.createConversationLanguageState("bilingual-auto");
  state = language.updateConversationLanguageState(state, language.detectConversationLanguage("I need an appointment"));
  state = language.updateConversationLanguageState(state, language.detectConversationLanguage("मुझे शाम का समय चाहिए"));
  assert.equal(state.detectedPrimaryLanguage, "english");
  assert.equal(state.currentPatientLanguage, "hindi");
  assert.equal(state.codeSwitchingOccurred, true);
});

test("records Hindi to English and Hindi to Hinglish switches without resetting state", () => {
  for (const next of ["Actually can you make it around 5 PM?", "Actually evening mein kar do"]) {
    let state = language.createConversationLanguageState("bilingual-auto");
    state = language.updateConversationLanguageState(state, language.detectConversationLanguage("मुझे अपॉइंटमेंट चाहिए"));
    state = language.updateConversationLanguageState(state, language.detectConversationLanguage(next));
    assert.equal(state.codeSwitchingOccurred, true);
  }
});

test("classifies bilingual receptionist intents into canonical values", () => {
  const cases = [
    ["I need a cleaning appointment", "book_appointment"],
    ["Mujhe appointment chahiye", "book_appointment"],
    ["मुझे कल अपॉइंटमेंट चाहिए", "book_appointment"],
    ["Mera appointment cancel karna hai", "cancel_appointment"],
    ["अपॉइंटमेंट रद्द करना है", "cancel_appointment"],
    ["Reschedule karke Monday kar sakte ho", "reschedule_appointment"],
    ["अपॉइंटमेंट दूसरे दिन कर सकते हैं", "reschedule_appointment"],
    ["Mere daant mein bahut pain ho raha hai", "emergency"],
    ["Doctor kab available hain?", "office_hours"],
    ["Cleaning ki fees kitni hai?", "pricing"],
    ["Kya insurance accept karte hain?", "insurance"],
    ["Mujhe kisi se baat karni hai", "human_agent"],
    ["Tell me about parking", "general_question"],
  ];
  for (const [utterance, expected] of cases) assert.equal(intents.intentClassifier.classify(utterance).intent, expected, utterance);
});

test("extracts canonical appointment date, time, and procedure from Hinglish", () => {
  const result = extraction.extractAppointmentData("I need cleaning karwani hai kal 4 baje");
  assert.equal(result.appointment.reason, "cleaning");
  assert.equal(result.appointment.preferredDate.toLowerCase(), "kal");
  assert.equal(result.appointment.preferredTime.toLowerCase(), "4 baje");
});

test("production prompt instructs natural bilingual speech, canonical output, and no diagnosis", () => {
  const prompt = readFileSync(new URL("../lib/ai/prompts.ts", import.meta.url), "utf8");
  assert.match(prompt, /conversational Hindi/);
  assert.match(prompt, /Roman-script Hinglish/);
  assert.match(prompt, /canonical English machine values/);
  assert.match(prompt, /Do not diagnose/);
});
