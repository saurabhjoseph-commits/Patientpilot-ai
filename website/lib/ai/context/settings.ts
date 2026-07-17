// website/lib/ai/context/settings.ts

import type { AISettings } from "./types";

/**
 * ============================================================
 * AI Runtime Settings
 * ============================================================
 */

const DEFAULT_SETTINGS: AISettings = {
  voice: "alloy",

  language: "en",

  enableRecording: false,

  enableHumanHandoff: true,

  defaultAppointmentDuration: 60,
};

export function getAISettings(): AISettings {
  return DEFAULT_SETTINGS;
}