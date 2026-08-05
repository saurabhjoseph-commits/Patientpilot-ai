/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Core Logger
 * ============================================================
 */

export type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error";

export interface LogContext {
  clinicId?: string;
  patientId?: string;
  conversationId?: string;
  workflowId?: string;
  requestId?: string;
  userId?: string;

  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}

export interface Logger {
  debug(
    message: string,
    context?: LogContext
  ): void;

  info(
    message: string,
    context?: LogContext
  ): void;

  warn(
    message: string,
    context?: LogContext
  ): void;

  error(
    message: string,
    error?: Error,
    context?: LogContext
  ): void;
}

/**
 * Default console logger.
 *
 * Can later be replaced with:
 * - Sentry
 * - Datadog
 * - Azure Monitor
 * - Cloud Logging
 */
class ConsoleLogger implements Logger {
  private write(entry: LogEntry): void {
    const output = {
      ...entry,
    };

    switch (entry.level) {
      case "debug":
        console.debug(output);
        break;

      case "info":
        console.info(output);
        break;

      case "warn":
        console.warn(output);
        break;

      case "error":
        console.error(output);
        break;
    }
  }

  debug(
    message: string,
    context?: LogContext
  ): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: "debug",
      message,
      context,
    });
  }

  info(
    message: string,
    context?: LogContext
  ): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: "info",
      message,
      context,
    });
  }

  warn(
    message: string,
    context?: LogContext
  ): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: "warn",
      message,
      context,
    });
  }

  error(
    message: string,
    error?: Error,
    context?: LogContext
  ): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      context,
      error,
    });
  }
}

/**
 * Default logger instance.
 */
export const logger: Logger = new ConsoleLogger();