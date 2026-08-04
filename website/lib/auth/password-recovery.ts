const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_RECOVERY_MESSAGE = "If an account exists for this email, a password-reset link has been sent.";

export function isValidRecoveryEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function validateNewPassword(password: string): string | null {
  if (password.length < 12) return "Use at least 12 characters.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "Use uppercase, lowercase, and a number.";
  }
  return null;
}

export function getPasswordRecoveryRedirectUrl(appUrl = process.env.NEXT_PUBLIC_APP_URL): string {
  if (!appUrl) throw new Error("Application URL is not configured.");
  const url = new URL(appUrl);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (!isLocal && url.protocol !== "https:") throw new Error("Application URL must use HTTPS.");
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("Application URL must be an origin without a path, query, or fragment.");
  }
  return new URL("/auth/callback?next=/reset-password", url).toString();
}
