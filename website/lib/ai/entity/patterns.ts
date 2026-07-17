// website/lib/ai/entity/patterns.ts

export const PHONE_REGEX =
  /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/;

export const EMAIL_REGEX =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

export const TIME_REGEX =
  /\b\d{1,2}(?::\d{2})?\s?(?:am|pm)?\b/i;

export const DATE_PATTERNS = [
  /\b(?:today|tomorrow)\b/i,
  /\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
];

export const PROCEDURES = [
  "cleaning",
  "checkup",
  "exam",
  "consultation",
  "filling",
  "crown",
  "bridge",
  "implant",
  "root canal",
  "extraction",
  "whitening",
  "veneers",
  "emergency",
];

export const NAME_PATTERNS = [
  /\bmy name is\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)+)/i,
  /\bi am\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)+)/i,
  /\bi'm\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)+)/i,
];