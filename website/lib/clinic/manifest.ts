import type { PlatformManifest } from "@/lib/platform";

import { CLINIC_FEATURE_FLAG } from "./constants";

import { ClinicPermissions } from "./permissions";

export const clinicManifest: PlatformManifest = {
  id: "clinic",

  name: "Clinic Management",

  version: "1.0.0",

  owner: "Healthcare",

  enabled: true,

  featureFlag: CLINIC_FEATURE_FLAG,

  permissions: Object.values(ClinicPermissions),

  routes: ["/admin/clinics"],

  navigation: [
    {
      label: "Clinics",
      href: "/admin/clinics",
      icon: "Building2",
    },
  ],
};