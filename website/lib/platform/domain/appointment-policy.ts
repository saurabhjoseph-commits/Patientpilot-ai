/**
 * ============================================================
 * PatientPilot AI
 * Appointment Policy
 * ============================================================
 */

import { Appointment } from "./appointment.types";

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export class AppointmentPolicy {
  static canConfirm(
    appointment: Appointment,
  ): PolicyDecision {
    if (appointment.status !== "scheduled") {
      return {
        allowed: false,
        reason:
          "Only scheduled appointments can be confirmed.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canCheckIn(
    appointment: Appointment,
    now: Date = new Date(),
  ): PolicyDecision {
    if (appointment.status !== "confirmed") {
      return {
        allowed: false,
        reason:
          "Only confirmed appointments can be checked in.",
      };
    }

    if (
      appointment.schedule.startTime > now
    ) {
      return {
        allowed: false,
        reason:
          "Appointment has not started yet.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canStart(
    appointment: Appointment,
  ): PolicyDecision {
    if (
      appointment.status !== "checked_in"
    ) {
      return {
        allowed: false,
        reason:
          "Appointment must be checked in before it can begin.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canComplete(
    appointment: Appointment,
  ): PolicyDecision {
    if (
      appointment.status !== "in_progress"
    ) {
      return {
        allowed: false,
        reason:
          "Only appointments in progress can be completed.",
      };
    }

    return {
      allowed: true,
    };
  }

  static canCancel(
    appointment: Appointment,
  ): PolicyDecision {
    switch (appointment.status) {
      case "completed":
      case "cancelled":
      case "no_show":
        return {
          allowed: false,
          reason:
            "Appointment cannot be cancelled.",
        };

      default:
        return {
          allowed: true,
        };
    }
  }

  static canReschedule(
    appointment: Appointment,
  ): PolicyDecision {
    switch (appointment.status) {
      case "completed":
      case "cancelled":
        return {
          allowed: false,
          reason:
            "Appointment cannot be rescheduled.",
        };

      default:
        return {
          allowed: true,
        };
    }
  }

  static canMarkNoShow(
    appointment: Appointment,
    now: Date = new Date(),
  ): PolicyDecision {
    if (
      appointment.status !== "confirmed"
    ) {
      return {
        allowed: false,
        reason:
          "Only confirmed appointments can become no-shows.",
      };
    }

    if (
      appointment.schedule.endTime > now
    ) {
      return {
        allowed: false,
        reason:
          "Appointment has not finished yet.",
      };
    }

    return {
      allowed: true,
    };
  }

  static requiresReminder(
    appointment: Appointment,
  ): boolean {
    return (
      appointment.reminder.enabled &&
      !appointment.reminder.reminderSent
    );
  }

  static requiresConfirmation(
    appointment: Appointment,
  ): boolean {
    return (
      appointment.status ===
        "scheduled" &&
      !appointment.reminder
        .confirmationSent
    );
  }

  static isUpcoming(
    appointment: Appointment,
    now: Date = new Date(),
  ): boolean {
    return (
      appointment.schedule.startTime >
      now
    );
  }

  static isPast(
    appointment: Appointment,
    now: Date = new Date(),
  ): boolean {
    return (
      appointment.schedule.endTime <
      now
    );
  }

  static isCompleted(
    appointment: Appointment,
  ): boolean {
    return (
      appointment.status ===
      "completed"
    );
  }

  static isActive(
    appointment: Appointment,
  ): boolean {
    return (
      appointment.status ===
        "confirmed" ||
      appointment.status ===
        "checked_in" ||
      appointment.status ===
        "in_progress"
    );
  }
}