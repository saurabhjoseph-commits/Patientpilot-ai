import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("sign-out revokes the Supabase session and clears legacy compatibility cookies", () => {
  const route = read("app/api/auth/sign-out/route.ts");
  const cookies = read("lib/infrastructure/identity/AuthCookies.ts");
  assert.match(route, /createRouteHandlerClient/);
  assert.match(route, /supabase\.auth\.signOut\(\)/);
  assert.match(route, /clearAuthCookies\(response\)/);
  assert.match(route, /pp_refresh_token/);
  assert.match(cookies, /pp_access_token/);
  assert.match(cookies, /pp_refresh_token/);
  assert.doesNotMatch(route, /console\.|token\.toString|password/i);
});

test("authenticated shell exposes reachable shared sign-out controls on desktop and mobile", () => {
  const topbar = read("components/admin/Topbar.tsx");
  const sidebar = read("components/admin/Sidebar.tsx");
  const button = read("components/auth/LogoutButton.tsx");
  assert.match(topbar, /LogoutButton/);
  assert.match(sidebar, /LogoutButton/);
  assert.match(sidebar, /onComplete=\{onNavigate\}/);
  assert.match(button, /fetch\("\/api\/auth\/sign-out", \{ method: "POST" \}\)/);
  assert.match(button, /router\.replace\("\/login"\)/);
  assert.match(button, /Sign out/);
});

test("post-logout admin access remains server protected and Supabase identity wins over stale legacy state", () => {
  const proxy = read("proxy.ts");
  const auth = read("lib/auth-server.ts");
  assert.match(proxy, /getCompatibilityIdentity\(request\)/);
  assert.ok(proxy.indexOf("getCompatibilityIdentity(request)") < proxy.indexOf("pp_access_token"));
  assert.match(proxy, /NextResponse\.redirect\(new URL\("\/login", request\.url\)\)/);
  assert.match(auth, /Supabase Auth plus profiles is the authoritative launch identity/);
  assert.ok(auth.indexOf("const supabase = await createClient()") < auth.indexOf('store.get("pp_access_token")'));
});

test("sign-out uses relative canonical navigation and does not expose a deployment hostname", () => {
  const button = read("components/auth/LogoutButton.tsx");
  const route = read("app/api/auth/sign-out/route.ts");
  assert.match(button, /router\.replace\("\/login"\)/);
  assert.doesNotMatch(`${button}\n${route}`, /vercel\.app|https?:\/\//);
});
