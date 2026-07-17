import { AppError } from "@/lib/core/errors";
import { logger } from "@/lib/core/logger";
import type { ServiceResult } from "@/lib/core/shared";

export abstract class BaseService {
  protected log(message: string, meta?: unknown): void {
    logger.info(message, meta);
  }

  protected warn(message: string, meta?: unknown): void {
    logger.warn(message, meta);
  }

  protected fail(message: string, code = "SERVICE_ERROR"): never {
    logger.error(message);

    throw new AppError(message, {
      code,
      statusCode: 500,
    });
  }

  protected ok<T>(data: T): ServiceResult<T> {
    return {
      success: true,
      data,
    };
  }

  protected error<T = never>(message: string): ServiceResult<T> {
    return {
      success: false,
      error: message,
    };
  }
}