export interface PlatformManifest {
  id: string;
  name: string;
  version: string;
  dependencies?: string[];
  featureFlag?: string;
}