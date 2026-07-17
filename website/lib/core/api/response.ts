import { NextResponse } from "next/server";

/**
 * Standard API response shape.
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
  };
}

/**
 * 200 OK
 */
export function success<T>(
  data: T,
  message = "Success"
): NextResponse {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return NextResponse.json(body, {
    status: 200,
  });
}

/**
 * 201 Created
 */
export function created<T>(
  data: T,
  message = "Created successfully."
): NextResponse {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return NextResponse.json(body, {
    status: 201,
  });
}

/**
 * 400 Bad Request
 */
export function badRequest(
  message = "Bad request."
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code: "BAD_REQUEST",
      },
    },
    {
      status: 400,
    }
  );
}

/**
 * 401 Unauthorized
 */
export function unauthorized(
  message = "Unauthorized."
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code: "UNAUTHORIZED",
      },
    },
    {
      status: 401,
    }
  );
}

/**
 * 403 Forbidden
 */
export function forbidden(
  message = "Forbidden."
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code: "FORBIDDEN",
      },
    },
    {
      status: 403,
    }
  );
}

/**
 * 404 Not Found
 */
export function notFound(
  message = "Not found."
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code: "NOT_FOUND",
      },
    },
    {
      status: 404,
    }
  );
}

/**
 * 500 Internal Server Error
 */
export function serverError(
  message = "Internal server error."
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code: "INTERNAL_SERVER_ERROR",
      },
    },
    {
      status: 500,
    }
  );
}