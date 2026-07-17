export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

export interface PlatformManifest {
  id: string;

  name: string;

  version: string;

  description?: string;

  owner?: string;

  dependencies?: string[];

  featureFlag?: string;

  permissions?: string[];

  routes?: string[];

  navigation?: NavigationItem[];

  enabled?: boolean;
}