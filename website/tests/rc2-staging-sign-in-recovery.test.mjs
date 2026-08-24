import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("valid Supabase sign-in reaches the SSR client before profile authorization", () => {
  const route = read("app/api/auth/sign-in/route.ts");
  assert.match(route, /createRouteHandlerClient\(request, supabaseResponse\)/);
  assert.match(route, /supabase\.auth\.signInWithPassword\(\{ email, password \}\)/);
  assert.ok(route.indexOf("signInWithPassword") < route.indexOf('.from("profiles")'));
  assert.match(route, /clearAuthCookies\(supabaseResponse\)/);
});

test("invalid passwords return a controlled 401 and never use legacy JWT authentication", () => {
  const route = read("app/api/auth/sign-in/route.ts");
  assert.match(route, /failure\("INVALID_CREDENTIALS", 401, "Invalid email or password\."\)/);
  assert.doesNotMatch(route, /createSignInUseCase|bootstrapInfrastructure|JWT_ACCESS_SECRET|JWT_REFRESH_SECRET/);
});

test("missing Supabase configuration fails closed before an auth request", () => {
  const route = read("app/api/auth/sign-in/route.ts");
  const configuration = read("lib/auth/sign-in-configuration.ts");
  assert.match(route, /getSignInConfiguration\(\)/);
  assert.match(route, /failure\("CONFIGURATION_ERROR", 503/);
  assert.match(configuration, /!supabaseUrl \|\| !supabaseAnonKey \|\| !supabaseServiceRoleKey/);
});

test("profile and clinic authorization remain required after authentication", () => {
  const route = read("app/api/auth/sign-in/route.ts");
  assert.match(route, /failure\("PROFILE_NOT_FOUND", 403/);
  assert.match(route, /\.from\("clinics"\)/);
  assert.match(route, /failure\("CLINIC_NOT_FOUND", 403/);
});

test("Preview deployments pin the expected Supabase project without exposing keys", () => {
  const configuration = read("lib/auth/sign-in-configuration.ts");
  const environment = read(".env.example");
  assert.match(configuration, /source\.VERCEL_ENV === "preview"/);
  assert.match(configuration, /expectedReference !== reference/);
  assert.match(environment, /SUPABASE_EXPECTED_PROJECT_REF=/);
  assert.doesNotMatch(configuration, /console\.|password|request\.json/i);
});

test("the public sign-in route bypasses proxy identity validation and Preview-safe cookies remain host-only", () => {
  const proxy = read("proxy.ts");
  const routeClient = read("lib/supabase/route-handler-client.ts");
  assert.match(proxy, /pathname\.startsWith\("\/api\/auth\/"\)/);
  assert.doesNotMatch(proxy.match(/matcher: \[[\s\S]*?\]/)?.[0] ?? "", /"\/api\/auth\/:path\*"/);
  assert.doesNotMatch(routeClient, /domain\s*:/i);
  assert.match(routeClient, /response\.cookies\.set/);
});

test("server diagnostics have bounded codes and never log credentials, provider errors, or stack traces", () => {
  const route = read("app/api/auth/sign-in/route.ts");
  for (const code of [
    "CONFIGURATION_ERROR",
    "SUPABASE_AUTH_ERROR",
    "INVALID_CREDENTIALS",
    "PROFILE_NOT_FOUND",
    "CLINIC_NOT_FOUND",
    "COOKIE_ERROR",
    "UNEXPECTED_ERROR",
  ]) {
    assert.match(route, new RegExp(code));
  }
  assert.match(route, /console\.warn\("auth\.sign_in\.failure", \{ code \}\)/);
  assert.doesNotMatch(route, /console\.(?:warn|error|log)\([^\n]*(?:password|supabaseError|profileError|clinicError|stack)/i);
});
