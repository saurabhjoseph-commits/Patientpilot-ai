// website/lib/ai/entity/extractor.ts

import type {
  AppointmentData,
  PatientData,
} from "../core";

import {
  PHONE_REGEX,
  EMAIL_REGEX,
  TIME_REGEX,
  DATE_PATTERNS,
  PROCEDURES,
  NAME_PATTERNS,
} from "./patterns";

export interface EntityExtractionResult {
  patient: Partial<PatientData>;
  appointment: Partial<AppointmentData>;
}

function extractPhone(
  text: string,
): string | undefined {
  return text.match(PHONE_REGEX)?.[0];
}

function extractEmail(
  text: string,
): string | undefined {
  return text.match(EMAIL_REGEX)?.[0];
}

function extractTime(
  text: string,
): string | undefined {
  return text.match(TIME_REGEX)?.[0];
}

function extractDate(
  text: string,
): string | undefined {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);

    if (match) {
      return match[0];
    }
  }

  return undefined;
}

function extractProcedure(
  text: string,
): string | undefined {
  const lower = text.toLowerCase();

  return PROCEDURES.find((procedure) =>
    lower.includes(procedure),
  );
}

function extractName(
  text: string,
): string | undefined {
  for (const pattern of NAME_PATTERNS) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

export function extractEntities(
  message: string,
): EntityExtractionResult {
  const name = extractName(message);
  const phone = extractPhone(message);
  const email = extractEmail(message);
  const date = extractDate(message);
  const time = extractTime(message);
  const procedure =
    extractProcedure(message);

  return {
    patient: {
      fullName: name,
      phone,
      email,
    },

    appointment: {
      patientName: name,
      phoneNumber: phone,
      email,
      procedure,
      reason: procedure,
      preferredDate: date,
      preferredTime: time,

      /**
       * Legacy aliases
       */
      appointmentDate: date,
      appointmentTime: time,
    },
  };
}