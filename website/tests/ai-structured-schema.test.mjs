import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function loadSchema(path) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const match = source.match(/export const conversationResponseSchema = ([\s\S]+) as const;/);
  assert.ok(match, `${path} must export a literal structured-output schema`);
  return Function(`"use strict"; return (${match[1]});`)();
}

function acceptsOpenAIStrictSchema(node, path = "schema") {
  if (!node || typeof node !== "object") return;
  const types = Array.isArray(node.type) ? node.type : [node.type];
  if (types.includes("object")) {
    assert.equal(node.additionalProperties, false, `${path} must reject additional properties`);
    const properties = Object.keys(node.properties ?? {}).sort();
    const required = [...(node.required ?? [])].sort();
    assert.deepEqual(required, properties, `${path}.required must contain every property exactly once`);
    for (const [key, value] of Object.entries(node.properties ?? {})) acceptsOpenAIStrictSchema(value, `${path}.${key}`);
  }
  if (node.items) acceptsOpenAIStrictSchema(node.items, `${path}.items`);
}

test("all PatientPilot response schemas satisfy OpenAI strict structured-output requirements", () => {
  for (const path of ["lib/ai/schema.ts", "lib/ai/execution/schema.ts"]) {
    const responseFormat = loadSchema(path);
    assert.equal(responseFormat.strict, true, `${path} must enable strict mode`);
    acceptsOpenAIStrictSchema(responseFormat.schema);
    assert.deepEqual(responseFormat.schema.properties.appointment.type, ["object", "null"]);
    assert.deepEqual(responseFormat.schema.properties.appointment.properties.patientName.type, ["string", "null"]);
  }
});
