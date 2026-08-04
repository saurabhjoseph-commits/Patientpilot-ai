/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Performance Logger
 * ============================================================
 */

import { logger, type LogContext } from "./logger";

export interface PerformanceEntry {
  operation: string;

  durationMs: number;

  success: boolean;

  context?: LogContext;

  metadata?: Record<string, unknown>;
}

export interface PerformanceTimer {
  stop(
    success?: boolean,
    metadata?: Record<string, unknown>
  ): number;
}

/**
 * Records a completed performance measurement.
 */
export function recordPerformance(
  entry: PerformanceEntry
): void {
  logger.info("Performance", {
    operation: entry.operation,

    durationMs: entry.durationMs,

    success: entry.success,

    metadata: entry.metadata,

    ...entry.context,
  });
}

/**
 * Starts a performance timer.
 *
 * Example:
 *
 * const timer = startPerformanceTimer("OpenAI Response");
 * ...
 * timer.stop();
 */
export function startPerformanceTimer(
  operation: string,
  context?: LogContext
): PerformanceTimer {
  const started = performance.now();

  return {
    stop(
      success = true,
      metadata?: Record<string, unknown>
    ): number {
      const durationMs = Number(
        (performance.now() - started).toFixed(2)
      );

      recordPerformance({
        operation,
        durationMs,
        success,
        context,
        metadata,
      });

      return durationMs;
    },
  };
}

/**
 * Measures an async operation automatically.
 */
export async function measureAsync<T>(
  operation: string,
  action: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const timer = startPerformanceTimer(
    operation,
    context
  );

  try {
    const result = await action();

    timer.stop(true);

    return result;
  } catch (error) {
    timer.stop(false);

    throw error;
  }
}

/**
 * Measures a synchronous operation automatically.
 */
export function measure<T>(
  operation: string,
  action: () => T,
  context?: LogContext
): T {
  const timer = startPerformanceTimer(
    operation,
    context
  );

  try {
    const result = action();

    timer.stop(true);

    return result;
  } catch (error) {
    timer.stop(false);

    throw error;
  }
}