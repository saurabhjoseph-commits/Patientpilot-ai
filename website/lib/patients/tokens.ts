import { createServiceToken } from "@/lib/core/container";

export const PATIENT_TOKENS = {
  REPOSITORY: createServiceToken<unknown>(
    "patients.repository"
  ),

  SERVICE: createServiceToken<unknown>(
    "patients.service"
  ),
} as const;