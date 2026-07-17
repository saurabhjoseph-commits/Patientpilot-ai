export interface ServiceFactory<T> {
  (): T;
}

export interface ServiceContainer {
  register<T>(token: symbol, factory: ServiceFactory<T>): void;

  registerSingleton<T>(token: symbol, instance: T): void;

  resolve<T>(token: symbol): T;

  has(token: symbol): boolean;

  clear(): void;
}