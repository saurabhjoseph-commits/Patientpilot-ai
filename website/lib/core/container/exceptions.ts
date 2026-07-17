import { AppError } from "@/lib/core/errors";

export class ServiceNotFoundError extends AppError {
  constructor(token: string) {
    super(`Service "${token}" is not registered.`, {
      code: "SERVICE_NOT_FOUND",
      statusCode: 500,
    });
  }
}