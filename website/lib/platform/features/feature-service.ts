import { featureRegistry } from "./feature-registry";

export class FeatureService {
  isEnabled(featureId: string): boolean {
    return featureRegistry.isEnabled(featureId);
  }
}

export const features = new FeatureService();