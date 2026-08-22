import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

function loadTypeScriptModule(path) {
  const compiled = ts.transpileModule(read(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  Function("module", "exports", compiled)(loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

test("verified speech and status callbacks bind CallSid to the resolved clinic before state mutation", () => {
  const speech = read("app/api/ai/respond/route.ts");
  const status = read("app/api/twilio/status/route.ts");

  for (const route of [speech, status]) {
    assert.match(route, /verifyTwilioWebhook/);
    assert.match(route, /const scope = resolveTelephonyClinic/);
    assert.match(route, /await resolveCallOwnership\(scope, callSid\)/);
  }
  assert.ok(
    speech.indexOf("await resolveCallOwnership(scope, callSid)") < speech.indexOf("await executeConversationWorkflow"),
    "speech callback must verify durable call ownership before workflow execution",
  );
  assert.ok(
    status.indexOf("await resolveCallOwnership(scope, callSid)") < status.indexOf("switch (callStatus)"),
    "status callback must verify durable call ownership before live-call mutation",
  );
});

test("silence and disconnect paths are explicit and do not create an appointment", () => {
  const speech = read("app/api/ai/respond/route.ts");
  const status = read("app/api/twilio/status/route.ts");
  const workflowStart = speech.indexOf("await executeConversationWorkflow");
  const silenceBranch = speech.indexOf("if (!isUsableSpeechRecognition(speechResult, speechConfidence))");
  const silenceReturn = speech.indexOf("return new NextResponse", silenceBranch);

  assert.ok(silenceBranch >= 0 && silenceReturn < workflowStart);
  assert.match(speech, /noInputPrompt/);
  for (const terminalStatus of ["completed", "busy", "failed", "no-answer", "canceled"]) {
    assert.match(status, new RegExp(`case "${terminalStatus}"`));
  }
});

test("bad input remains a general question and ordinary dental wording is not escalated", () => {
  const { intentClassifier } = loadTypeScriptModule("lib/ai/intent-classifier.ts");
  assert.equal(intentClassifier.classify("zxqv 123 ???").intent, "general_question");
  assert.equal(intentClassifier.classify("I want information about tooth cleaning").intent, "general_question");
  assert.equal(intentClassifier.classify("My tooth is bleeding and I have severe pain").intent, "emergency");
});

test("clinic prompt context fails closed and never invents insurance acceptance", () => {
  const context = read("lib/ai/clinic-receptionist-context.ts");
  const prompt = read("lib/ai/prompts.ts");
  assert.match(context, /acceptedInsurance: \[\]/);
  assert.match(context, /throw new ClinicReceptionistConfigurationError/);
  assert.match(prompt, /Never invent insurance coverage/);
  assert.match(prompt, /Never guess insurance eligibility/);
});
