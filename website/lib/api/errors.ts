import { AppError } from "@/lib/core/errors";

export function toAppError(
  error: unknown,
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(
    "Internal Server Error",
    {
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
    },
  );
}