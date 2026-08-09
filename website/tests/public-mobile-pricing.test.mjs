import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("public header has compact mobile controls and closes navigation after selection", () => {
  const header = read("components/Header.tsx");
  const layout = read("app/(website)/layout.tsx");
  assert.match(header, /h-\[72px\]/);
  assert.match(header, /h-11 w-11/);
  assert.match(header, /border-slate-200 bg-white/);
  assert.doesNotMatch(header, /mix-blend/);
  assert.match(header, /aria-expanded/);
  assert.match(header, /onClick=\{\(\) => setMobileOpen\(false\)\}/);
  assert.match(header, /focus-visible:ring-2/);
  assert.match(layout, /pt-\[72px\] md:pt-20/);
  assert.match(layout, /public-site min-h-screen bg-white text-slate-900/);
});

test("public marketing pages keep an explicit light theme and readable light-surface labels", () => {
  const css = read("app/globals.css");
  const roi = read("components/roi/ROICalculator.tsx");
  const comparison = read("components/pricing/FeatureComparison.tsx");
  const contactInfo = read("components/contact/ContactInfo.tsx");

  assert.match(css, /\.public-site\s*\{[\s\S]*color-scheme: light/);
  assert.match(roi, /font-semibold text-slate-900/);
  assert.match(comparison, /w-full text-slate-900/);
  assert.match(contactInfo, /mailto:support@patientpilotai\.com/);
  assert.match(contactInfo, /tel:\+919794898619/);
});

test("pricing cards use explicit readable text on white cards and retain a CTA per plan", () => {
  const cards = read("components/pricing/PricingCards.tsx");
  assert.match(cards, /bg-white p-6 text-slate-900/);
  assert.match(cards, /text-slate-700/);
  assert.match(cards, /text-emerald-600/);
  assert.doesNotMatch(cards, /<span>\{feature\}<\/span>/);
  assert.equal((cards.match(/href=\{/g) ?? []).length, 1);
  assert.match(cards, /plan\.button === "Book Demo"/);
  assert.match(cards, /min-h-12/);
});
