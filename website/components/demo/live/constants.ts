// components/demo/live/constants.ts

import type { DemoStage } from "./types";

export const DEMO_TITLE = "PatientPilot AI";

export const CLINIC_NAME = "Bright Smile Dental";

export const PHONE_STATUS_HEIGHT = 720;

export const PHONE_STATUS_WIDTH = 360;

export const DEFAULT_AVATAR_SIZE = 128;

export const PROGRESS_ANIMATION_MS = 350;

export const MESSAGE_ANIMATION_MS = 300;

export const AI_CONFIDENCE_COLOR =
  "bg-emerald-500";

export const STAGE_ORDER: DemoStage[] = [
  "idle",
  "ringing",
  "connected",
  "conversation",
  "thinking",
  "booking",
  "crm_update",
  "completed",
];