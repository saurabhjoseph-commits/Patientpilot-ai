import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("public header has compact mobile controls and closes navigation after selection", () => {
  const header = read("components/Header.tsx");
  const layout = read("app/(website)/layout.tsx");
  assert.match(header, /h-\[72px\]/);
  assert.match(header, /h-11 w-11/);
  assert.match(header, /aria-expanded/);
  assert.match(header, /onClick=\{\(\) => setMobileOpen\(false\)\}/);
  assert.match(header, /focus-visible:ring-2/);
  assert.match(layout, /pt-\[72px\] md:pt-20/);
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
