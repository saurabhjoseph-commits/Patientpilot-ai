/**
 * ============================================================
 * PatientPilot AI
 * Authorization Error
 * ============================================================
 *
 * Represents authorization failures within the
 * Application Layer.
 */

import type { ApplicationError } from "./ApplicationError";

export type AuthorizationFailureReason =
  | "UNAUTHENTICATED"
  | "INSUFFICIENT_PERMISSIONS"
  | "INVALID_ROLE"
  | "TENANT_ACCESS_DENIED"
  | "RESOURCE_ACCESS_DENIED"
  | "FEATURE_DISABLED";

export interface AuthorizationError extends ApplicationError {
  readonly code: "UNAUTHORIZED" | "FORBIDDEN";

  readonly reason: AuthorizationFailureReason;

  readonly requiredPermissions?: readonly string[];

  readonly requiredRoles?: readonly string[];

  readonly currentRole?: string;
}

export class AuthorizationErrorFactory {
  static unauthenticated(
    message = "Authentication is required.",
  ): AuthorizationError {
    return {
      code: "UNAUTHORIZED",
      message,
      reason: "UNAUTHENTICATED",
    };
  }

  /**
   * Generic authorization failure.
   *
   * Used as the default fallback when no more specific
   * authorization error is available.
   */
  static forbidden(
    message = "Access denied.",
  ): AuthorizationError {
    return {
      code: "FORBIDDEN",
      message,
      reason: "RESOURCE_ACCESS_DENIED",
    };
  }

  static insufficientPermissions(
    requiredPermissions: readonly string[],
    message = "You do not have permission to perform this action.",
  ): AuthorizationError {
    return {
      code: "FORBIDDEN",
      message,
      reason: "INSUFFICIENT_PERMISSIONS",
      requiredPermissions,
    };
  }

  static invalidRole(
    currentRole: string,
    requiredRoles: readonly string[],
    message = "Your role is not authorized to perform this action.",
  ): AuthorizationError {
    return {
      code: "FORBIDDEN",
      message,
      reason: "INVALID_ROLE",
      currentRole,
      requiredRoles,
    };
  }

  static tenantAccessDenied(
    message = "You are not authorized to access this clinic.",
  ): AuthorizationError {
    return {
      code: "FORBIDDEN",
      message,
      reason: "TENANT_ACCESS_DENIED",
    };
  }

  static resourceAccessDenied(
    message = "You are not authorized to access this resource.",
  ): AuthorizationError {
    return {
      code: "FORBIDDEN",
      message,
      reason: "RESOURCE_ACCESS_DENIED",
    };
  }

  static featureDisabled(
    message = "This feature is currently unavailable.",
  ): AuthorizationError {
    return {
      code: "FORBIDDEN",
      message,
      reason: "FEATURE_DISABLED",
    };
  }
}