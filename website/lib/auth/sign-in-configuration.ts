export type SignInConfiguration = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
};

export type SignInConfigurationResult =
  | { ok: true; value: SignInConfiguration }
  | { ok: false };

type SignInEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_EXPECTED_PROJECT_REF?: string;
  VERCEL_ENV?: string;
};

function projectReference(url: URL): string | null {
  const suffix = ".supabase.co";
  if (url.protocol !== "https:" || !url.hostname.endsWith(suffix)) return null;

  const reference = url.hostname.slice(0, -suffix.length);
  return reference.length > 0 && !reference.includes(".") ? reference : null;
}

/**
 * Validates only the configuration needed by the Supabase Auth sign-in path.
 * Legacy JWT configuration is intentionally excluded: Supabase Auth is the
 * credential source for the India launch compatibility flow.
 */
export function getSignInConfiguration(
  source: SignInEnvironment = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_EXPECTED_PROJECT_REF: process.env.SUPABASE_EXPECTED_PROJECT_REF,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
): SignInConfigurationResult {
  const supabaseUrl = source.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = source.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const supabaseServiceRoleKey = source.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return { ok: false };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(supabaseUrl);
  } catch {
    return { ok: false };
  }

  const reference = projectReference(parsedUrl);
  if (!reference) return { ok: false };

  // Preview deployments must pin their non-secret project reference. This
  // prevents a staging deployment from silently connecting to production.
  if (source.VERCEL_ENV === "preview") {
    const expectedReference = source.SUPABASE_EXPECTED_PROJECT_REF?.trim();
    if (!expectedReference || expectedReference !== reference) {
      return { ok: false };
    }
  }

  return {
    ok: true,
    value: { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey },
  };
}
