import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("tenant dashboard presentation derives profile and clinic identity on the server", () => {
  const presentation = read("lib/clinic/dashboard-presentation.ts");
  const layout = read("app/admin/layout.tsx");
  const dashboard = read("app/admin/page.tsx");
  assert.match(presentation, /from\("profiles"\).*full_name/s);
  assert.match(presentation, /profile\.clinic_id !== identity\.clinicId/);
  assert.match(presentation, /from\("clinics"\).*eq\("id", identity\.clinicId\)/s);
  assert.match(presentation, /Clinic Dashboard/);
  assert.match(presentation, /isPlatformAdmin/);
  assert.match(layout, /getAdminDashboardPresentation/);
  assert.match(dashboard, /getAdminDashboardPresentation/);
  assert.match(dashboard, /identity\.clinicId/);
});

test("tenant presentation replaces generic dashboard identity while super admins retain platform branding", () => {
  const sidebar = read("components/admin/Sidebar.tsx");
  const topbar = read("components/admin/Topbar.tsx");
  const overview = read("components/admin/DashboardOverview.tsx");
  assert.match(sidebar, /presentation\.isPlatformAdmin \? "PatientPilot AI" : presentation\.clinicName/);
  assert.match(sidebar, /presentation\.dashboardLabel/);
  assert.match(topbar, /Welcome back, \{presentation\.userName\}/);
  assert.match(topbar, /presentation\.isPlatformAdmin \? "PatientPilot AI" : presentation\.clinicName/);
  assert.match(overview, /Welcome back, \{userName\}/);
  assert.match(overview, /isPlatformAdmin \? "PatientPilot AI Dashboard"/);
});

test("global navigation stays hidden for clinic users and server authorization remains in force", () => {
  const sidebar = read("components/admin/Sidebar.tsx");
  const context = read("lib/doctors/clinic-context.ts");
  const clinics = read("app/admin/clinics/page.tsx");
  assert.match(sidebar, /requiresGlobalManagement: true/);
  assert.match(sidebar, /canManageGlobal/);
  assert.match(context, /Cross-clinic doctor access is not permitted/);
  assert.match(clinics, /if \(!managesClinicsGlobally\) query = query\.eq\("id", identity\.clinicId\)/);
});

test("canonical production URLs use the shared configuration rather than the Vercel hostname", () => {
  const config = read("lib/config/app.ts");
  const recovery = read("lib/auth/password-recovery.ts");
  const onboarding = read("lib/clinic/owner-onboarding.ts");
  const proxy = read("proxy.ts");
  const deployment = read("docs/DEPLOYMENT.md");
  assert.match(config, /getApplicationOrigin/);
  assert.match(config, /NEXT_PUBLIC_APP_URL must use the canonical production domain/);
  assert.match(config, /shouldRedirectToCanonicalHost/);
  assert.match(recovery, /absoluteUrl\("\/auth\/callback\?next=\/reset-password"\)/);
  assert.match(onboarding, /absoluteUrl\(`\/auth\/callback\?next=\$\{next\}`\)/);
  assert.match(proxy, /shouldRedirectToCanonicalHost/);
  assert.match(proxy, /NextResponse\.redirect\(canonical, 308\)/);
  assert.match(deployment, /NEXT_PUBLIC_APP_URL=https:\/\/www\.patientpilot-ai\.com/);
  assert.doesNotMatch(`${recovery}\n${onboarding}`, /patientpilot-ai\.vercel\.app/);
});

test("clinic readiness CTA is derived from the authenticated owner clinic", () => {
  const dashboard = read("app/admin/page.tsx");
  assert.match(dashboard, /getClinicOperationalReadiness\(identity\.clinicId\)/);
  assert.match(dashboard, /href=\{`\/admin\/clinics\/\$\{identity\.clinicId\}`\}/);
});
