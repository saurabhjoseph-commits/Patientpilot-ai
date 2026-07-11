// ======================================================
// PatientPilot AI
// Date & Time Utilities
// ======================================================

/**
 * Format:
 * Jul 11, 2026
 */
export function formatDate(
  value: string | Date | null | undefined
): string {
  if (!value) return "-";

  return new Date(value).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

/**
 * Format:
 * Jul 11, 2026, 10:45 AM
 */
export function formatDateTime(
  value: string | Date | null | undefined
): string {
  if (!value) return "-";

  return new Date(value).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

/**
 * Format:
 * 10:45 AM
 */
export function formatTime(
  value: string | Date | null | undefined
): string {
  if (!value) return "-";

  return new Date(value).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

/**
 * Format:
 * Jul 11
 */
export function formatShortDate(
  value: string | Date | null | undefined
): string {
  if (!value) return "-";

  return new Date(value).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}

/**
 * Relative time
 *
 * Examples:
 * Just now
 * 5 minutes ago
 * 2 hours ago
 * Yesterday
 * 3 days ago
 */
export function relativeTime(
  value: string | Date | null | undefined
): string {
  if (!value) return "-";

  const now = new Date().getTime();
  const then = new Date(value).getTime();

  const seconds = Math.floor(
    (now - then) / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} minute${
      minutes !== 1 ? "s" : ""
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hour${
      hours !== 1 ? "s" : ""
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 30) {
    return `${days} days ago`;
  }

  return formatDate(value);
}