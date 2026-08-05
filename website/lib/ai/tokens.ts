import { createServiceToken } from "@/lib/core/container";

export const AI_TOKENS = {
  SERVICE: createServiceToken<unknown>(
    "ai.service"
  ),
} as const;