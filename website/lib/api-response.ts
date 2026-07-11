// ======================================================
// PatientPilot AI
// Standard API Response Helpers
// ======================================================

import { NextResponse } from "next/server";

/**
 * Standard Success Response
 */
export function successResponse<T = unknown>(
  data?: T,
  message = "Success",
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    {
      status,
    }
  );
}

/**
 * Standard Error Response
 */
export function errorResponse(
  message = "Something went wrong.",
  status = 500,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details:
        process.env.NODE_ENV === "development"
          ? details
          : undefined,
    },
    {
      status,
    }
  );
}

/**
 * Validation Error
 */
export function validationError(
  message = "Validation failed."
) {
  return errorResponse(message, 400);
}

/**
 * Unauthorized
 */
export function unauthorizedResponse(
  message = "Unauthorized."
) {
  return errorResponse(message, 401);
}

/**
 * Forbidden
 */
export function forbiddenResponse(
  message = "Forbidden."
) {
  return errorResponse(message, 403);
}

/**
 * Not Found
 */
export function notFoundResponse(
  message = "Resource not found."
) {
  return errorResponse(message, 404);
}

/**
 * Conflict
 */
export function conflictResponse(
  message = "Conflict."
) {
  return errorResponse(message, 409);
}

/**
 * Internal Server Error
 */
export function serverError(
  details?: unknown
) {
  return errorResponse(
    "Internal Server Error",
    500,
    details
  );
}