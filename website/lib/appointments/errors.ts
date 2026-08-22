/** Safe, provider-independent representation of an atomic scheduling rejection. */
export class AppointmentSlotConflictError extends Error {
  readonly code = "APPOINTMENT_SLOT_CONFLICT";
  constructor() { super("This appointment time is no longer available. Please choose another slot."); this.name = "AppointmentSlotConflictError"; }
}

export function mapAppointmentPersistenceError(error: unknown): unknown {
  if (!error || typeof error !== "object") return error;
  const row = error as Record<string, unknown>;
  if (row.code === "23P01" || row.message === "H3.1 appointment slot conflict") return new AppointmentSlotConflictError();
  return error;
}

export function isAppointmentSlotConflict(error: unknown): error is AppointmentSlotConflictError {
  return error instanceof AppointmentSlotConflictError;
}
