/**
 * ============================================================
 * PatientPilot AI
 * Global AI Front Office Manager
 *
 * Communication Channel Constants
 * ============================================================
 */

import type { Channel } from "../types/common";

export const CHANNELS = {
  PHONE: "phone",
  WHATSAPP: "whatsapp",
  WEBSITE: "website",
  SMS: "sms",
  EMAIL: "email",
} as const satisfies Record<string, Channel>;

export const SUPPORTED_CHANNELS: readonly Channel[] = [
  CHANNELS.PHONE,
  CHANNELS.WHATSAPP,
  CHANNELS.WEBSITE,
  CHANNELS.SMS,
  CHANNELS.EMAIL,
] as const;

export const CHANNEL_DISPLAY_NAMES: Readonly<Record<Channel, string>> = {
  phone: "Phone",
  whatsapp: "WhatsApp",
  website: "Website Chat",
  sms: "SMS",
  email: "Email",
};

export const CHANNEL_ICONS: Readonly<Record<Channel, string>> = {
  phone: "phone",
  whatsapp: "message-circle",
  website: "globe",
  sms: "message-square",
  email: "mail",
};

export const DEFAULT_ENABLED_CHANNELS: readonly Channel[] = [
  CHANNELS.PHONE,
  CHANNELS.WHATSAPP,
  CHANNELS.WEBSITE,
];

export const REAL_TIME_CHANNELS: readonly Channel[] = [
  CHANNELS.PHONE,
  CHANNELS.WHATSAPP,
  CHANNELS.WEBSITE,
];

export const ASYNC_CHANNELS: readonly Channel[] = [
  CHANNELS.SMS,
  CHANNELS.EMAIL,
];

export const CHANNEL_PRIORITY: Readonly<Record<Channel, number>> = {
  phone: 1,
  whatsapp: 2,
  website: 3,
  sms: 4,
  email: 5,
};