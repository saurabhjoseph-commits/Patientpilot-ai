/**
 * ============================================================
 * PatientPilot AI
 * Authentication Provider
 * ============================================================
 *
 * Defines the identity provider responsible for authenticating
 * a platform user.
 *
 * This enum belongs to the Domain Layer and must remain
 * framework-independent.
 */

/**
 * Supported authentication providers.
 */
export enum AuthenticationProvider {
  /**
   * Local username/password authentication managed
   * by PatientPilot AI.
   */
  Local = "local",

  /**
   * Supabase Authentication.
   */
  Supabase = "supabase",

  /**
   * Google OAuth / OpenID Connect.
   */
  Google = "google",

  /**
   * Microsoft Azure AD / Microsoft Entra ID.
   */
  Microsoft = "microsoft",

  /**
   * Apple Sign In.
   */
  Apple = "apple",

  /**
   * Generic OpenID Connect provider.
   */
  OpenIdConnect = "openid_connect",

  /**
   * Generic OAuth 2.0 provider.
   */
  OAuth2 = "oauth2",

  /**
   * System account.
   *
   * Used by background jobs, AI agents,
   * scheduled workflows, and internal services.
   */
  System = "system",
}

/**
 * Interactive authentication providers.
 */
export const INTERACTIVE_AUTHENTICATION_PROVIDERS: readonly AuthenticationProvider[] =
  [
    AuthenticationProvider.Local,
    AuthenticationProvider.Supabase,
    AuthenticationProvider.Google,
    AuthenticationProvider.Microsoft,
    AuthenticationProvider.Apple,
    AuthenticationProvider.OpenIdConnect,
    AuthenticationProvider.OAuth2,
  ] as const;

/**
 * Non-interactive authentication providers.
 */
export const NON_INTERACTIVE_AUTHENTICATION_PROVIDERS: readonly AuthenticationProvider[] =
  [
    AuthenticationProvider.System,
  ] as const;

/**
 * Returns true when the provider represents
 * a human user authentication flow.
 */
export function isInteractiveAuthenticationProvider(
  provider: AuthenticationProvider,
): boolean {
  return INTERACTIVE_AUTHENTICATION_PROVIDERS.includes(
    provider,
  );
}