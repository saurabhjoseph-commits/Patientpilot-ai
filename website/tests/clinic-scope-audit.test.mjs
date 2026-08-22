import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import twilio from "twilio";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("public intake resolves clinic ownership server-side", () => {
  const route = read("app/api/book-demo/route.ts");
  const mapper = read("lib/leads/mapper.ts");
  assert.match(route, /resolvePublicIntakeClinic/);
  assert.match(mapper, /clinic_id: clinicId/);
  assert.doesNotMatch(route, /body\.clinic_id/);
});

test("migration package retains the ownership-to-constraint sequence", () => {
  const preflight = read("lib/supabase/migrations/0003_j2_ownership_preflight.sql");
  const backfill = read("lib/supabase/migrations/0004_j2_bootstrap_clinic_backfill.sql");
  const constraints = read("lib/supabase/migrations/0005_j2_clinic_ownership_constraints.sql");
  assert.match(preflight, /ownership count drifted/);
  assert.match(backfill, /returning id into bootstrap_clinic_id/);
  assert.match(backfill, /update public\.call_messages m set clinic_id = c\.clinic_id/);
  assert.match(constraints, /clinic ownership contains NULL values/);
});

test("ownership-sensitive inserts include clinic_id", () => {
  assert.match(read("lib/appointments/mapper.ts"), /clinic_id: input\.clinicId/);
  assert.match(read("app/api/calls/route.ts"), /clinic_id: resolveAdminClinic/);
  assert.match(read("app/api/transcript/route.ts"), /clinic_id: parentCall\.clinic_id/);
  assert.match(read("lib/infrastructure/persistence/supabase/repositories/ClinicSettingsRepository.ts"), /clinic_id: data\.clinicId/);
});

test("G1 removes only the audited legacy demo appointments and fails closed on drift", () => {
  const cleanup = read("lib/supabase/migrations/0016a_g1_legacy_demo_appointment_cleanup.sql");
  assert.match(cleanup, /begin;/i);
  assert.match(cleanup, /commit;/i);
  assert.match(cleanup, /appointment_count <> 4 or unowned_appointment_count <> 4/);
  assert.match(cleanup, /patient_count <> 0/);
  assert.match(cleanup, /delete from public\.appointments[\s\S]*where clinic_id is null/i);
  assert.doesNotMatch(cleanup, /insert into public\.appointments/i);
  assert.doesNotMatch(cleanup, /update public\.appointments/i);
});

test("G2 service catalog is clinic-scoped, validated, and has no browser policy", () => {
  const migration = read("lib/supabase/migrations/0017_g2_clinic_services.sql");
  assert.match(migration, /clinic_id uuid not null/);
  assert.match(migration, /references public\.clinics\(id\)/);
  assert.match(migration, /default_duration_minutes > 0/);
  assert.match(migration, /default_price is null or default_price >= 0/);
  assert.match(migration, /unique index clinic_services_clinic_name_key/);
  assert.match(migration, /enable row level security/);
  assert.doesNotMatch(migration, /create policy/i);
  assert.doesNotMatch(migration, /insert into public\.clinic_services/i);
});

test("G3 doctor-service assignments reject cross-clinic relationships", () => {
  const migration = read("lib/supabase/migrations/0018_g3_doctors.sql");
  assert.match(migration, /foreign key \(doctor_id, clinic_id\) references public\.doctors\(id, clinic_id\)/);
  assert.match(migration, /foreign key \(service_id, clinic_id\) references public\.clinic_services\(id, clinic_id\)/);
  assert.match(migration, /doctors_duration_positive/);
  assert.match(migration, /alter table public\.doctors enable row level security/);
  assert.doesNotMatch(migration, /create policy/i);
});

test("G4 schedule, leave, room, and blocked-time contracts retain clinic ownership", () => {
  const migration = read("lib/supabase/migrations/0019_g4_doctor_scheduling.sql");
  for (const table of ["clinic_rooms", "doctor_schedules", "doctor_leave", "doctor_room_assignments", "blocked_time"]) {
    assert.match(migration, new RegExp(`create table public\\.${table}`));
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security`));
  }
  assert.match(migration, /foreign key \(doctor_id, clinic_id\) references public\.doctors\(id, clinic_id\)/);
  assert.match(migration, /foreign key \(room_id, clinic_id\) references public\.clinic_rooms\(id, clinic_id\)/);
  assert.match(migration, /blocked_time_target check \(doctor_id is not null or room_id is not null\)/);
  assert.doesNotMatch(migration, /create policy/i);
});

test("every appointment creation flow supplies a trusted clinic_id", () => {
  const types = read("lib/appointments/types.ts");
  const validation = read("lib/appointments/validation.ts");
  const mapper = read("lib/appointments/mapper.ts");
  const adminApi = read("app/api/appointments/route.ts");
  const aiTool = read("lib/ai/tools/appointment.ts");
  const aiWorkflow = read("lib/appointments/integration.ts");

  assert.match(types, /readonly clinicId: string;/);
  assert.match(validation, /Trusted clinic scope is required/);
  assert.match(mapper, /clinic_id: input\.clinicId/);
  assert.match(adminApi, /clinicId: resolveAdminClinic\(authorization\)\.clinicId/);
  assert.doesNotMatch(adminApi, /input\.clinic_id|body\.clinic_id/);
  assert.match(aiTool, /clinicId: context\.clinicScope\.clinicId/);
  assert.match(aiWorkflow, /clinicId: scope\.clinicId/);
});

test("appointment persistence uses only authoritative production columns", () => {
  const mapper = read("lib/appointments/mapper.ts");
  const repository = read("lib/appointments/repository.ts");
  for (const column of ["clinic_id", "patient_name", "phone", "email", "service", "appointment_date", "appointment_time", "notes", "source"]) {
    assert.match(mapper, new RegExp(`${column}:`));
  }
  for (const unsupported of ["clinic_name:", "phone_number:", "reason:", "call_sid:", "lead_id:"]) {
    assert.doesNotMatch(mapper, new RegExp(unsupported));
  }
  assert.match(repository, /\.eq\("clinic_id", scope\.clinicId\)/);
});

test("legacy appointment request names map to supported service and phone fields", () => {
  const route = read("app/api/appointments/route.ts");
  const workflow = read("lib/appointments/integration.ts");
  assert.match(route, /appointment_type.*input\.service.*input\.reason/);
  assert.match(workflow, /service: booking\.serviceName/);
  assert.match(workflow, /serviceId: booking\.serviceId/);
  assert.match(workflow, /phone:\s*appointment\.phoneNumber/);
});

test("patient persistence carries the review-only clinic ownership contract", () => {
  const repository = read("lib/patients/repository.ts");
  const mapper = read("lib/patients/mapper.ts");
  const migration = read("lib/supabase/migrations/0024_agent1_patient_clinic_isolation_review.sql");
  for (const column of ["clinic_name", "first_name", "last_name", "full_name", "phone_number", "preferred_contact_method", "total_appointments", "last_appointment_date", "last_call_date"]) {
    assert.match(mapper, new RegExp(column));
  }
  assert.match(repository, /fromPatientPersistence/);
  assert.match(repository, /toPatientCreatePersistence/);
  assert.match(repository, /toPatientUpdatePersistence/);
  assert.doesNotMatch(repository, /row: any/);
  assert.match(mapper, /clinic_id:/);
  assert.match(repository, /\.eq\("clinic_id", clinicId\)/);
  assert.match(migration, /add column clinic_id uuid/);
  assert.match(migration, /alter column clinic_id set not null/);
  assert.doesNotMatch(mapper, /appointment_id:/);
  assert.doesNotMatch(mapper, /call_sid:/);
  assert.match(mapper, /preferred_contact_method/);
});

test("patient synchronization follows successful appointment creation", () => {
  const workflow = read("lib/workflows/conversation-workflow.ts");
  assert.match(workflow, /appointmentResult\.created/);
  assert.match(workflow, /await syncPatient\(/);
  assert.match(workflow, /appointment,\s*context\.clinicName/);
});

test("baseline restores patient, profile, and summary ownership constraints", () => {
  const baseline = read("lib/supabase/migrations/0000_j2_staging_baseline_schema.sql");
  assert.match(baseline, /create table public\.patients/);
  assert.match(baseline, /create table public\.profiles/);
  assert.match(baseline, /call_summaries_patient_id_fkey foreign key \(patient_id\) references public\.patients\(id\) on update no action on delete set null/);
  assert.match(baseline, /call_summaries_outcome_check check \(outcome = any \(array\['appointment_created'::text, 'appointment_requested'::text, 'rescheduled'::text, 'cancelled'::text, 'information_only'::text, 'transferred'::text, 'incomplete'::text, 'unknown'::text\]\)\)/);
  assert.match(baseline, /profiles_clinic_id_fkey foreign key \(clinic_id\) references public\.clinics\(id\) on update no action on delete cascade/);
  assert.match(baseline, /alter table public\.profiles enable row level security/);
});

test("lead activity is reached only through a clinic-scoped contact", () => {
  const route = read("app/api/admin/activity/route.ts");
  assert.match(route, /from\("contacts"\)/);
  assert.match(route, /\.eq\("clinic_id", resolveAdminClinic/);
});

test("operational endpoints require Identity middleware", () => {
  const proxy = read("proxy.ts");
  for (const endpoint of ["/api/appointments", "/api/calls", "/api/transcript", "/api/test-console"]) {
    assert.match(proxy, new RegExp(endpoint.replaceAll("/", "\\/")));
  }
});

test("staging configuration is documented and fails closed", () => {
  const scope = read("lib/clinic/clinic-scope.ts");
  const example = read(".env.example");
  assert.match(scope, /PUBLIC_INTAKE_CLINIC_ID must be configured as a UUID/);
  assert.match(scope, /No trusted telephony clinic mapping exists/);
  assert.match(example, /PUBLIC_INTAKE_CLINIC_ID=/);
  assert.match(example, /TELEPHONY_CLINIC_PHONE_MAP=/);
});

test("Twilio webhooks use the official validator before clinic resolution or workflow execution", () => {
  const security = read("lib/telephony/twilio-webhook-security.ts");
  const voice = read("app/api/twilio/voice/route.ts");
  const status = read("app/api/twilio/status/route.ts");
  const aiRespond = read("app/api/ai/respond/route.ts");
  assert.match(security, /validateRequest/);
  assert.match(security, /x-twilio-signature/);
  assert.match(security, /TWILIO_WEBHOOK_BASE_URL/);
  assert.ok(voice.indexOf("const verification") < voice.indexOf("resolveTelephonyClinic(to)"));
  assert.ok(status.indexOf("const verification") < status.indexOf("resolveTelephonyClinic(to)"));
  assert.ok(aiRespond.indexOf("const verification") < aiRespond.indexOf("const scope = resolveTelephonyClinic"));
});

test("Twilio webhook boundary rejects missing or invalid signatures and supports proxy-safe URL reconstruction", () => {
  const security = read("lib/telephony/twilio-webhook-security.ts");
  assert.match(security, /if \(!signature\) return \{ ok: false, status: 401 \}/);
  assert.match(security, /if \(!validateRequest\(authToken, signature, url, params\)\)/);
  assert.match(security, /x-forwarded-host/);
  assert.match(security, /x-forwarded-proto/);
  assert.match(security, /TWILIO_WEBHOOK_BASE_URL is required outside local development/);
});

test("Twilio SDK accepts a valid signature and rejects a tampered signature", () => {
  const authToken = "test-auth-token";
  const url = "https://app.example.test/api/twilio/voice";
  const params = { CallSid: "CA123", From: "+15550000001", To: "+15550000002" };
  const signature = twilio.getExpectedTwilioSignature(authToken, url, params);
  assert.equal(twilio.validateRequest(authToken, signature, url, params), true);
  assert.equal(twilio.validateRequest(authToken, `${signature}tampered`, url, params), false);
});

test("Twilio duplicate delivery and optional timestamp protections are fail-closed", () => {
  const security = read("lib/telephony/twilio-webhook-security.ts");
  assert.match(security, /x-twilio-request-timestamp/);
  assert.match(security, /DEFAULT_REPLAY_WINDOW_MS/);
  assert.match(security, /fingerprintVerifiedRequest/);
  assert.match(security, /getWebhookDeliveryExpiry/);
});

test("webhook delivery persistence atomically claims a unique verified fingerprint", () => {
  const migration = read("lib/supabase/migrations/0008_j3_webhook_deliveries.sql");
  const repository = read("lib/infrastructure/persistence/supabase/repositories/WebhookDeliveryRepository.ts");
  assert.match(migration, /UNIQUE \(provider, fingerprint\)/);
  assert.match(repository, /\.insert\(/);
  assert.match(repository, /error\?\.code === "23505"/);
  assert.match(repository, /markCompleted/);
  assert.match(repository, /markFailed/);
  assert.match(repository, /deleteExpired/);
});

test("durable delivery records contain no raw signature, token, speech, or payload fields", () => {
  const migration = read("lib/supabase/migrations/0008_j3_webhook_deliveries.sql");
  const table = migration.match(/CREATE TABLE public\.webhook_deliveries \(([\s\S]*?)\n\);/i)?.[1] ?? "";
  for (const forbidden of ["signature", "auth_token", "speech", "payload", "body"]) {
    assert.doesNotMatch(table, new RegExp(`\\b${forbidden}\\b`, "i"));
  }
});

test("webhook routes claim before clinic resolution and workflow processing", () => {
  const voice = read("app/api/twilio/voice/route.ts");
  const status = read("app/api/twilio/status/route.ts");
  const aiRespond = read("app/api/ai/respond/route.ts");
  for (const route of [voice, status, aiRespond]) {
    assert.ok(route.indexOf("verifyTwilioWebhook") < route.indexOf("deliveries.claim"));
  }
  assert.ok(voice.indexOf("deliveries.claim") < voice.indexOf("resolveTelephonyClinic(to)"));
  assert.ok(status.indexOf("deliveries.claim") < status.indexOf("resolveTelephonyClinic(to)"));
  assert.ok(aiRespond.indexOf("deliveries.claim") < aiRespond.indexOf("const scope = resolveTelephonyClinic"));
  assert.ok(aiRespond.indexOf("deliveries.claim") < aiRespond.indexOf("await executeConversationWorkflow"));
});

test("webhook delivery retention is restricted to a server-only scheduled endpoint", () => {
  const cleanup = read("app/api/internal/webhook-deliveries/cleanup/route.ts");
  assert.match(cleanup, /WEBHOOK_CLEANUP_CRON_SECRET/);
  assert.match(cleanup, /timingSafeEqual/);
  assert.match(cleanup, /cleanupExpired/);
});

test("telephony routes do not log request signatures or speech transcripts", () => {
  const security = read("lib/telephony/twilio-webhook-security.ts");
  const aiRespond = read("app/api/ai/respond/route.ts");
  assert.doesNotMatch(security, /console\.(log|error).*signature/i);
  assert.doesNotMatch(aiRespond, /console\.(log|error)[\s\S]*speechResult/);
});

test("the legacy unsigned Twilio endpoint is retired and Telnyx has no active route", () => {
  const legacyRoute = read("app/api/twilio/route.ts");
  assert.match(legacyRoute, /status: 410/);
  assert.equal(existsSync(new URL("../app/api/telnyx", import.meta.url)), false);
});

test("live call monitoring is an authenticated staff API", () => {
  const route = read("app/api/live/calls/route.ts");
  assert.match(route, /requirePermission\(request, Permissions\.CallsRead\)/);
});

test("clinic navigation and pages are gated by the server-derived clinic.read permission", () => {
  const sidebar = read("components/admin/Sidebar.tsx");
  const shell = read("components/admin/AdminShell.tsx");
  const layout = read("app/admin/layout.tsx");
  const clinicsPage = read("app/admin/clinics/page.tsx");
  const newClinicPage = read("app/admin/clinics/new/page.tsx");

  assert.match(sidebar, /name: "Clinics"/);
  assert.match(sidebar, /href: "\/admin\/clinics"/);
  assert.match(sidebar, /icon: Building2/);
  assert.match(sidebar, /pathname\.startsWith\(item\.href\)/);
  assert.match(sidebar, /canViewClinics/);
  assert.match(shell, /canViewClinics/);
  assert.match(layout, /user\.permissionCodes\.includes\(Permissions\.ClinicRead\)/);
  assert.match(clinicsPage, /requireAdminPagePermission\(Permissions\.ClinicRead\)/);
  assert.match(newClinicPage, /requireAdminPagePermission\(Permissions\.ClinicUpdate\)/);
  assert.match(clinicsPage, /href="\/admin\/clinics\/new"/);
});

test("clinic onboarding uses India defaults, normalized slugs, and an atomic server-side creation path", () => {
  const contract = read("lib/clinic/onboarding-contract.ts");
  const route = read("app/api/admin/clinics/route.ts");
  const wizard = read("app/admin/clinics/new/NewClinicWizard.tsx");
  const migration = read("lib/supabase/migrations/0009_india_clinic_onboarding.sql");

  assert.match(contract, /country: "India"/);
  assert.match(contract, /timezone: "Asia\/Kolkata"/);
  assert.match(contract, /currency: "INR"/);
  assert.match(contract, /normalizeClinicSlug/);
  assert.match(route, /requirePermission\(request, Permissions\.ClinicUpdate\)/);
  assert.match(route, /validateClinicOnboarding/);
  assert.match(route, /create_clinic_with_settings/);
  assert.doesNotMatch(route, /tenantId|clinicId|roleCodes/);
  assert.match(wizard, /if \(submitting\) return/);
  assert.match(wizard, /ownerAccount/);
  assert.match(wizard, /router\.replace\(createdId/);
  assert.match(migration, /insert into public\.clinics/);
  assert.match(migration, /insert into public\.clinic_settings/);
  assert.match(migration, /security definer/);
});

test("password recovery request is neutral, validated, and uses the supported Supabase API", () => {
  const page = read("app/forgot-password/page.tsx");
  const route = read("app/api/auth/password-recovery/route.ts");
  const auth = read("lib/auth.ts");
  assert.match(page, /Email address/);
  assert.match(page, /PASSWORD_RECOVERY_MESSAGE/);
  assert.match(route, /PASSWORD_RECOVERY_MESSAGE/);
  assert.match(route, /resetPasswordForEmail/);
  assert.match(auth, /redirectTo: getPasswordRecoveryRedirectUrl\(\)/);
});

test("password reset requires a recovery session and validates new passwords", () => {
  const page = read("app/reset-password/page.tsx");
  const completion = read("app/api/auth/complete-password-recovery/route.ts");
  const recovery = read("lib/auth/password-recovery.ts");
  assert.match(page, /PASSWORD_RECOVERY/);
  assert.match(page, /getSession/);
  assert.doesNotMatch(page, /exchangeCodeForSession/);
  assert.match(page, /updateUser\(\{ password \}\)/);
  assert.match(page, /complete-password-recovery/);
  assert.match(completion, /supabaseServer\.auth\.getUser\(accessToken\)/);
  assert.match(completion, /credential\.changePassword/);
  assert.match(page, /Passwords do not match/);
  assert.match(recovery, /password\.length < 12/);
  assert.match(recovery, /Application URL must use HTTPS/);
  assert.match(recovery, /\/auth\/callback\?next=\/reset-password/);
});

test("password recovery does not log or persist passwords and callback redirects are closed", () => {
  const recoveryRoute = read("app/api/auth/password-recovery/route.ts");
  const resetPage = read("app/reset-password/page.tsx");
  const callback = read("app/auth/callback/route.ts");
  assert.doesNotMatch(recoveryRoute, /console\./);
  assert.doesNotMatch(resetPage, /console\.(log|error)[\s\S]*password/i);
  assert.match(callback, /tokenHash/);
  assert.match(callback, /type === "recovery"/);
  assert.match(callback, /type === "invite"/);
  assert.match(callback, /supabase\.auth\.verifyOtp/);
  assert.match(callback, /token_hash: tokenHash/);
  assert.match(callback, /type: invitation \? "invite" : "recovery"/);
  assert.doesNotMatch(callback, /console\./);
});
