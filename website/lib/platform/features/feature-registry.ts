import { Feature } from "./feature";

class FeatureRegistry {
  private readonly features = new Map<string, Feature>();

  register(feature: Feature): void {
    this.features.set(feature.id, feature);
  }

  get(id: string): Feature | undefined {
    return this.features.get(id);
  }

  isEnabled(id: string): boolean {
    return this.features.get(id)?.enabled ?? false;
  }

  getAll(): Feature[] {
    return [...this.features.values()];
  }
}

export const featureRegistry = new FeatureRegistry();