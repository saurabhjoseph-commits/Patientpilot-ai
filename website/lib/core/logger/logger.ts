export interface Logger {
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
  debug(message: string, meta?: unknown): void;
}

class ConsoleLogger implements Logger {
  info(message: string, meta?: unknown) {
    console.info(message, meta);
  }

  warn(message: string, meta?: unknown) {
    console.warn(message, meta);
  }

  error(message: string, meta?: unknown) {
    console.error(message, meta);
  }

  debug(message: string, meta?: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(message, meta);
    }
  }
}

export const logger: Logger = new ConsoleLogger();