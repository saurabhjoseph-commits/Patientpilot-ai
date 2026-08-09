import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("shared public footer has the final accessible responsive brand and navigation layout", () => {
  const footer = read("components/home/Footer.tsx"); const layout = read("app/(website)/layout.tsx"); const adminLayout = read("app/admin/layout.tsx");
  assert.match(layout, /<Footer \/>/); assert.doesNotMatch(adminLayout, /components\/home\/Footer/); assert.match(footer, /bg-slate-950 text-white/); assert.doesNotMatch(footer, /next\/image|\/images\/logo\.png|mix-blend/);
  assert.match(footer, /PatientPilot[\s\S]*text-cyan-400[\s\S]*AI/); assert.match(footer, /AI RECEPTIONIST FOR DENTAL PRACTICES/); assert.match(footer, /support@patientpilotai\.com/);
  for (const href of ["/", "/solutions", "/pricing", "/book-demo", "/about", "/contact"]) assert.match(footer, new RegExp(`href: "${href.replace("/", "\\/")}"`));
  assert.match(footer, /grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4/); assert.match(footer, /md:grid-cols-\[minmax\(0,1\.5fr\)_repeat\(4,minmax\(0,1fr\)\)\]/); assert.match(footer, /aria-label="Footer navigation"/); assert.match(footer, /focus-visible:ring-2/);
});
