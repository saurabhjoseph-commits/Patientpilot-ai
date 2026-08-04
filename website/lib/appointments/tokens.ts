import { createServiceToken } from "@/lib/core/container";

export const APPOINTMENT_TOKENS = {
  REPOSITORY: createServiceToken<unknown>(
    "appointments.repository"
  ),

  SERVICE: createServiceToken<unknown>(
    "appointments.service"
  ),
} as const;