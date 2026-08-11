import { absoluteUrl, getApplicationOrigin } from "@/lib/config/app";

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

export function getPasswordRecoveryRedirectUrl(appUrl?: string): string {
  // The shared origin validator retains the prior "Application URL must use HTTPS" guarantee.
  if (appUrl !== undefined) return new URL("/auth/callback?next=/reset-password", getApplicationOrigin(appUrl)).toString();
  return absoluteUrl("/auth/callback?next=/reset-password");
}
