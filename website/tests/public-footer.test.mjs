import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("one shared dark footer covers the public website layout without legacy image branding", () => {
  const footer = read("components/home/Footer.tsx");
  const layout = read("app/(website)/layout.tsx");
  const adminLayout = read("app/admin/layout.tsx");

  assert.match(layout, /import Footer from "@\/components\/home\/Footer"/);
  assert.match(layout, /<Footer \/>/);
  assert.doesNotMatch(adminLayout, /components\/home\/Footer/);
  assert.match(footer, /bg-slate-950 text-white/);
  assert.doesNotMatch(footer, /next\/image|\/images\/logo\.png|mix-blend/);
  assert.match(footer, /PatientPilot[\s\S]*AI/);
  assert.match(footer, /AI RECEPTIONIST FOR DENTAL PRACTICES/);
  for (const href of ["/", "/solutions", "/pricing", "/book-demo"]) assert.match(footer, new RegExp(`href: "${href.replace("/", "\\/")}"`));
  assert.match(footer, /© 2026 PatientPilot AI\. All rights reserved\./);
  assert.match(footer, /flex flex-wrap gap-x-6 gap-y-3/);
  assert.match(footer, /aria-label="Footer navigation"/);
  assert.match(footer, /focus-visible:ring-2/);
});
