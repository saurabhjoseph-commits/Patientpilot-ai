import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("India launch clinic, demo, mobile header, and strict-schema routes remain wired", () => {
  assert.match(read("components/admin/Sidebar.tsx"), /name: "Clinics"[\s\S]*href: "\/admin\/clinics"[\s\S]*requiresClinicRead: true/);
  assert.match(read("app/admin/layout.tsx"), /Permissions\.ClinicRead/);
  assert.equal(existsSync(new URL("../app/admin/clinics/new/NewClinicWizard.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../app/api/admin/clinics/route.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../lib/supabase/migrations/0009_india_clinic_onboarding.sql", import.meta.url)), true);
  assert.match(read("components/admin/DemoLauncher.tsx"), /href="\/admin\/demo"/);
  assert.equal(existsSync(new URL("../app/admin/demo/page.tsx", import.meta.url)), true);
  const publicHeader = read("components/Header.tsx");
  assert.match(publicHeader, /border-slate-200 bg-white/);
  assert.doesNotMatch(publicHeader, /mix-blend/);
  assert.match(read("lib/ai/schema.ts"), /"appointment"/);
});

test("clinic administrative role policy grants view access without expanding staff creation access", () => {
  const catalog = read("lib/platform/domain/identity/permission-catalog.ts");
  for (const role of ["super-admin", "clinic-owner", "administrator"]) {
    assert.match(catalog, new RegExp(`${role === "administrator" ? "administrator" : `"${role}"`}: allPermissions`));
  }
  assert.match(catalog, /"practice-manager": \[[\s\S]*Permissions\.ClinicRead\]/);
  assert.doesNotMatch(catalog.match(/"practice-manager": \[[\s\S]*?\],/)[0], /Permissions\.ClinicUpdate/);
  for (const role of ["dentist", "hygienist", "receptionist", "support", "ai-agent"]) {
    const entry = catalog.match(new RegExp(`${role === "ai-agent" ? '"ai-agent"' : role}: \\[([^\\]]*)\\]`));
    assert.ok(entry, `${role} must have an explicit policy`);
    assert.doesNotMatch(entry[0], /Permissions\.Clinic(Update|Read)/);
  }
  assert.match(read("app/admin/clinics/new/page.tsx"), /Permissions\.ClinicUpdate/);
  assert.match(read("app/api/admin/clinics/route.ts"), /Permissions\.ClinicUpdate/);
});
