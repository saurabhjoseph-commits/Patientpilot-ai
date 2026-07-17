import { NextResponse } from "next/server";

import { toAppError } from "./errors";

export async function handleRequest<T>(
  fn: () => Promise<T>,
) {
  try {
    const data = await fn();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const appError = toAppError(error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: appError.code,
          message: appError.message,
        },
      },
      {
        status: appError.statusCode,
      },
    );
  }
}