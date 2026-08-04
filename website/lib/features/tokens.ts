import { createServiceToken } from "@/lib/core/container";

export const FEATURE_TOKENS = {
  SERVICE: createServiceToken<unknown>(
    "features.service"
  ),
} as const;