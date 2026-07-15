// components/demo/live/formatter.ts

export function formatStageName(
  stage: string
): string {
  return stage
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatPercentage(
  value: number
): string {
  return `${Math.round(value)}%`;
}

export function formatConfidence(
  confidence: number
): string {
  return `${confidence}% Confidence`;
}

export function formatTranscriptCount(
  count: number
): string {
  return `${count} ${
    count === 1 ? "Entry" : "Entries"
  }`;
}

export function capitalize(
  value: string
): string {
  if (!value.length) return value;

  return value[0].toUpperCase() + value.slice(1);
}