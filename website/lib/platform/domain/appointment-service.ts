/**
 * ============================================================
 * PatientPilot AI
 * Appointment Service
 * ============================================================
 */

import {
  Appointment,
  AppointmentSchedule,
  AppointmentStatus,
} from "./appointment.types";

import {
  validateAppointment,
  ValidationResult,
} from "./appointment-validator";

import {
  AppointmentPolicy,
  PolicyDecision,
} from "./appointment-policy";

export class AppointmentService {
  validate(
    appointment: Appointment,
  ): ValidationResult {
    return validateAppointment(
      appointment,
    );
  }

  canConfirm(
    appointment: Appointment,
  ): PolicyDecision {
    return AppointmentPolicy.canConfirm(
      appointment,
    );
  }

  canCheckIn(
    appointment: Appointment,
    now?: Date,
  ): PolicyDecision {
    return AppointmentPolicy.canCheckIn(
      appointment,
      now,
    );
  }

  canStart(
    appointment: Appointment,
  ): PolicyDecision {
    return AppointmentPolicy.canStart(
      appointment,
    );
  }

  canComplete(
    appointment: Appointment,
  ): PolicyDecision {
    return AppointmentPolicy.canComplete(
      appointment,
    );
  }

  canCancel(
    appointment: Appointment,
  ): PolicyDecision {
    return AppointmentPolicy.canCancel(
      appointment,
    );
  }

  canReschedule(
    appointment: Appointment,
  ): PolicyDecision {
    return AppointmentPolicy.canReschedule(
      appointment,
    );
  }

  canMarkNoShow(
    appointment: Appointment,
    now?: Date,
  ): PolicyDecision {
    return AppointmentPolicy.canMarkNoShow(
      appointment,
      now,
    );
  }

  confirm(
    appointment: Appointment,
  ): Appointment {
    return {
      ...appointment,
      status: "confirmed",
      reminder: {
        ...appointment.reminder,
        confirmationSent: true,
      },
      updatedAt: new Date(),
    };
  }

  checkIn(
    appointment: Appointment,
  ): Appointment {
    return {
      ...appointment,
      status: "checked_in",
      updatedAt: new Date(),
    };
  }

  start(
    appointment: Appointment,
  ): Appointment {
    return {
      ...appointment,
      status: "in_progress",
      updatedAt: new Date(),
    };
  }

  complete(
    appointment: Appointment,
  ): Appointment {
    return {
      ...appointment,
      status: "completed",
      updatedAt: new Date(),
    };
  }

  cancel(
    appointment: Appointment,
  ): Appointment {
    return {
      ...appointment,
      status: "cancelled",
      updatedAt: new Date(),
    };
  }

  markNoShow(
    appointment: Appointment,
  ): Appointment {
    return {
      ...appointment,
      status: "no_show",
      updatedAt: new Date(),
    };
  }

  reschedule(
    appointment: Appointment,
    schedule: AppointmentSchedule,
  ): Appointment {
    return {
      ...appointment,
      status: "rescheduled",
      schedule,
      reminder: {
        ...appointment.reminder,
        confirmationSent: false,
        reminderSent: false,
        lastReminderAt: undefined,
      },
      updatedAt: new Date(),
    };
  }

  markReminderSent(
    appointment: Appointment,
  ): Appointment {
    return {
      ...appointment,
      reminder: {
        ...appointment.reminder,
        reminderSent: true,
        lastReminderAt: new Date(),
      },
      updatedAt: new Date(),
    };
  }

  updateStatus(
    appointment: Appointment,
    status: AppointmentStatus,
  ): Appointment {
    return {
      ...appointment,
      status,
      updatedAt: new Date(),
    };
  }

  updateNotes(
    appointment: Appointment,
    notes?: string,
  ): Appointment {
    return {
      ...appointment,
      notes,
      updatedAt: new Date(),
    };
  }

  addTag(
    appointment: Appointment,
    tag: string,
  ): Appointment {
    if (
      appointment.tags.includes(tag)
    ) {
      return appointment;
    }

    return {
      ...appointment,
      tags: [
        ...appointment.tags,
        tag,
      ],
      updatedAt: new Date(),
    };
  }

  removeTag(
    appointment: Appointment,
    tag: string,
  ): Appointment {
    return {
      ...appointment,
      tags:
        appointment.tags.filter(
          (t) => t !== tag,
        ),
      updatedAt: new Date(),
    };
  }

  requiresReminder(
    appointment: Appointment,
  ): boolean {
    return AppointmentPolicy.requiresReminder(
      appointment,
    );
  }

  requiresConfirmation(
    appointment: Appointment,
  ): boolean {
    return AppointmentPolicy.requiresConfirmation(
      appointment,
    );
  }

  isUpcoming(
    appointment: Appointment,
    now?: Date,
  ): boolean {
    return AppointmentPolicy.isUpcoming(
      appointment,
      now,
    );
  }

  isPast(
    appointment: Appointment,
    now?: Date,
  ): boolean {
    return AppointmentPolicy.isPast(
      appointment,
      now,
    );
  }

  isCompleted(
    appointment: Appointment,
  ): boolean {
    return AppointmentPolicy.isCompleted(
      appointment,
    );
  }

  isActive(
    appointment: Appointment,
  ): boolean {
    return AppointmentPolicy.isActive(
      appointment,
    );
  }
}

export const appointmentService =
  new AppointmentService();