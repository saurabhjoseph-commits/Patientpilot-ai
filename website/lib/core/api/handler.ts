import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AppError } from "./errors";
import {
  badRequest,
  serverError,
} from "./response";

/**
 * Standard API handler wrapper.
 *
 * Supports both:
 *
 * Static routes:
 *   (request)
 *
 * Dynamic routes:
 *   (request, context)
 */
export function apiHandler<TContext = unknown>(
  handler: (
    request: NextRequest,
    context: TContext
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    context: TContext
  ): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AppError) {
        return badRequest(error.message);
      }

      console.error("Unhandled API Error:", error);

      return serverError(
        "An unexpected error occurred."
      );
    }
  };
}