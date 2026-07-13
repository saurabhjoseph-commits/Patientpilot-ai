import type { AppointmentData } from "./types";

/**
 * ============================================================
 * PatientPilot AI Information Extractor
 * ============================================================
 */

export interface ExtractionResult {
  appointment: Partial<AppointmentData>;
  confidence: number;
}

/**
 * Extracts appointment information from
 * the patient's latest message.
 */
export function extractAppointmentData(
  text: string
): ExtractionResult {
  const appointment: Partial<AppointmentData> = {};

  let confidence = 0;

  /**
   * ----------------------------
   * Phone Number
   * ----------------------------
   */

  const phoneMatch = text.match(
    /(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/
  );

  if (phoneMatch) {
    appointment.phoneNumber = phoneMatch[0];
    confidence += 20;
  }

  /**
   * ----------------------------
   * Date
   * ----------------------------
   */

  const datePatterns = [
    /\b(today|tomorrow)\b/i,
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/,
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}\b/i,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);

    if (match) {
      appointment.appointmentDate = match[0];
      confidence += 20;
      break;
    }
  }

  /**
   * ----------------------------
   * Time
   * ----------------------------
   */

  const timeMatch = text.match(
    /\b\d{1,2}(?::\d{2})?\s?(am|pm)\b/i
  );

  if (timeMatch) {
    appointment.appointmentTime = timeMatch[0];
    confidence += 20;
  }

  /**
   * ----------------------------
   * Reason
   * ----------------------------
   */

  const reasons = [
    "cleaning",
    "checkup",
    "check-up",
    "cavity",
    "implant",
    "crown",
    "bridge",
    "root canal",
    "tooth pain",
    "wisdom tooth",
    "whitening",
    "emergency",
    "consultation",
    "filling",
  ];

  const lower = text.toLowerCase();

  const reason = reasons.find((item) =>
    lower.includes(item)
  );

  if (reason) {
    appointment.reason = reason;
    confidence += 20;
  }

  /**
   * ----------------------------
   * Patient Name
   * ----------------------------
   */

  const namePatterns = [
    /my name is ([A-Za-z\s'-]+)/i,
    /i am ([A-Za-z\s'-]+)/i,
    /this is ([A-Za-z\s'-]+)/i,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      appointment.patientName = cleanName(
        match[1]
      );

      confidence += 20;

      break;
    }
  }

  return {
    appointment,
    confidence,
  };
}

/**
 * Merges extracted information
 * into an existing appointment.
 */
export function mergeAppointmentData(
  current: Partial<AppointmentData>,
  extracted: Partial<AppointmentData>
): AppointmentData {
  return {
    ...current,
    ...Object.fromEntries(
      Object.entries(extracted).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
      )
    ),
  };
}

/**
 * Returns true if at least one field
 * was extracted.
 */
export function hasExtractedData(
  data: Partial<AppointmentData>
): boolean {
  return Object.values(data).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );
}

/**
 * Cleans a patient's spoken name.
 */
function cleanName(
  value: string
): string {
  return value
    .replace(/[.,!?]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}