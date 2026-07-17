import { PlatformManifest } from "./manifest";

class PlatformRegistry {
  private readonly manifests = new Map<string, PlatformManifest>();

  register(manifest: PlatformManifest): void {
    if (this.manifests.has(manifest.id)) {
      throw new Error(
        `Platform module "${manifest.id}" is already registered.`
      );
    }

    this.manifests.set(manifest.id, manifest);
  }

  get(id: string): PlatformManifest | undefined {
    return this.manifests.get(id);
  }

  getAll(): PlatformManifest[] {
    return [...this.manifests.values()];
  }

  isEnabled(id: string): boolean {
    return this.manifests.get(id)?.enabled ?? false;
  }
}

export const platformRegistry = new PlatformRegistry();