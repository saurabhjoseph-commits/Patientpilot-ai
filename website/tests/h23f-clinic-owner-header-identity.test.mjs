import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Supabase profile identity takes precedence over stale legacy cookies", () => {
  const auth = read("lib/auth-server.ts");
  const signIn = read("app/api/auth/sign-in/route.ts");
  assert.ok(auth.indexOf("const supabase = await createClient()") < auth.indexOf('store.get("pp_access_token")'));
  assert.match(auth, /from\("profiles"\).*clinic_id,role/s);
  assert.match(auth, /profile\.role === "owner"/);
  assert.match(signIn, /clearAuthCookies\(supabaseResponse\)/);
});

test("clinic-scoped dashboard presentation uses authenticated profile name and clinic name", () => {
  const presentation = read("lib/clinic/dashboard-presentation.ts");
  const shell = read("components/admin/AdminShell.tsx");
  const sidebar = read("components/admin/Sidebar.tsx");
  const topbar = read("components/admin/Topbar.tsx");
  const overview = read("components/admin/DashboardOverview.tsx");
  assert.match(presentation, /select\("clinic_id,full_name"\)/);
  assert.match(presentation, /profile\.clinic_id !== identity\.clinicId/);
  assert.match(presentation, /select\("name"\)/);
  assert.match(shell, /presentation=\{presentation\}/);
  assert.match(sidebar, /presentation\.clinicName/);
  assert.match(sidebar, /presentation\.dashboardLabel/);
  assert.match(topbar, /presentation\.userName/);
  assert.match(topbar, /presentation\.clinicName/);
  assert.match(topbar, /const clinicContext = presentation\.isPlatformAdmin \? "PatientPilot AI" : presentation\.clinicName/);
  assert.match(topbar, /Welcome back, \{presentation\.userName\}/);
  assert.match(topbar, /text-xs text-slate-400">\{clinicContext\}/);
  assert.match(overview, /Welcome back, \{userName\}/);
  assert.match(overview, /\$\{clinicName\} Dashboard/);
});

test("clinic identity never degrades into platform branding when its lookup fails", () => {
  const presentation = read("lib/clinic/dashboard-presentation.ts");
  const layout = read("app/admin/layout.tsx");
  assert.match(presentation, /Unable to resolve the authenticated clinic/);
  assert.match(layout, /Clinic configuration unavailable/);
  assert.match(layout, /getAdminDashboardPresentation/);
  assert.match(presentation, /identity\.roleCodes\.includes\("super-admin"\)/);
});

test("super admin remains the only platform identity and tenant context has no browser input", () => {
  const presentation = read("lib/clinic/dashboard-presentation.ts");
  const context = read("lib/doctors/clinic-context.ts");
  assert.match(presentation, /if \(isPlatformAdmin\) return \{ isPlatformAdmin: true/);
  assert.match(presentation, /userName: "Super Admin"/);
  assert.match(presentation, /dashboardLabel: "Admin Dashboard"/);
  assert.match(context, /Cross-clinic doctor access is not permitted/);
  assert.doesNotMatch(presentation, /searchParams|localStorage|request\.body/);
});
