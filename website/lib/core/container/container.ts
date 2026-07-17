import { ServiceContainer, ServiceFactory } from "./types";
import { ServiceNotFoundError } from "./exceptions";

class DefaultContainer implements ServiceContainer {
  private readonly services = new Map<symbol, unknown>();

  register<T>(token: symbol, factory: ServiceFactory<T>): void {
    this.services.set(token, factory());
  }

  registerSingleton<T>(token: symbol, instance: T): void {
    this.services.set(token, instance);
  }

  resolve<T>(token: symbol): T {
    const service = this.services.get(token);

    if (!service) {
      throw new ServiceNotFoundError(token.toString());
    }

    return service as T;
  }

  has(token: symbol): boolean {
    return this.services.has(token);
  }

  clear(): void {
    this.services.clear();
  }
}

export const container = new DefaultContainer();