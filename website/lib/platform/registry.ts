import { PlatformManifest } from "./manifest";

const registry = new Map<string, PlatformManifest>();

export function registerManifest(manifest: PlatformManifest) {
  registry.set(manifest.id, manifest);
}

export function getManifest(id: string) {
  return registry.get(id);
}

export function getAllManifests() {
  return [...registry.values()];
}