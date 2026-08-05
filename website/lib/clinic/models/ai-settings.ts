export type AfterHoursMode =
  | "voicemail"
  | "take-message"
  | "emergency-forward";

export interface ClinicAISettings {
  enabled: boolean;

  language: string;

  voice: string;

  appointmentBooking: boolean;

  appointmentCancellation: boolean;

  appointmentRescheduling: boolean;

  humanHandoff: boolean;

  afterHoursMode: AfterHoursMode;

  callRecording: boolean;

  transcriptStorage: boolean;
}

export const DEFAULT_CLINIC_AI_SETTINGS: ClinicAISettings = {
  enabled: true,

  language: "en-US",

  voice: "female-1",

  appointmentBooking: true,

  appointmentCancellation: true,

  appointmentRescheduling: true,

  humanHandoff: true,

  afterHoursMode: "take-message",

  callRecording: false,

  transcriptStorage: true,
};

export function isAIEnabled(
  settings: ClinicAISettings,
): boolean {
  return settings.enabled;
}

export function supportsAppointmentBooking(
  settings: ClinicAISettings,
): boolean {
  return settings.enabled && settings.appointmentBooking;
}

export function supportsAppointmentCancellation(
  settings: ClinicAISettings,
): boolean {
  return (
    settings.enabled &&
    settings.appointmentCancellation
  );
}

export function supportsAppointmentRescheduling(
  settings: ClinicAISettings,
): boolean {
  return (
    settings.enabled &&
    settings.appointmentRescheduling
  );
}

export function supportsHumanHandoff(
  settings: ClinicAISettings,
): boolean {
  return settings.enabled && settings.humanHandoff;
}

export function shouldRecordCalls(
  settings: ClinicAISettings,
): boolean {
  return (
    settings.enabled &&
    settings.callRecording
  );
}

export function shouldStoreTranscripts(
  settings: ClinicAISettings,
): boolean {
  return (
    settings.enabled &&
    settings.transcriptStorage
  );
}

export function isClinicAISettingsComplete(
  settings: ClinicAISettings,
): boolean {
  return (
    settings.language.trim().length > 0 &&
    settings.voice.trim().length > 0
  );
}