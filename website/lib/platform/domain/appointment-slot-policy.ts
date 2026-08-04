/**
 * ============================================================
 * PatientPilot AI
 * Appointment Slot Policy
 * ============================================================
 */

import { AppointmentSlot } from "./appointment-slot.types";

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

export class AppointmentSlotPolicy {
  static canReserve(
    slot: AppointmentSlot,
  ): PolicyDecision {
    if (slot.status !== "available") {
      return {
        allowed: false,
        reason:
          "Only available slots can be reserved.",
      };
    }

    return { allowed: true };
  }

  static canBook(
    slot: AppointmentSlot,
  ): PolicyDecision {
    if (slot.status !== "reserved") {
      return {
        allowed: false,
        reason:
          "Only reserved slots can be booked.",
      };
    }

    return { allowed: true };
  }

  static canRelease(
    slot: AppointmentSlot,
  ): PolicyDecision {
    if (slot.status !== "reserved") {
      return {
        allowed: false,
        reason:
          "Only reserved slots can be released.",
      };
    }

    return { allowed: true };
  }

  static canBlock(
    slot: AppointmentSlot,
  ): PolicyDecision {
    if (slot.status === "booked") {
      return {
        allowed: false,
        reason:
          "Booked slots cannot be blocked.",
      };
    }

    return { allowed: true };
  }

  static canUnblock(
    slot: AppointmentSlot,
  ): PolicyDecision {
    if (slot.status !== "blocked") {
      return {
        allowed: false,
        reason:
          "Only blocked slots can be unblocked.",
      };
    }

    return { allowed: true };
  }

  static canMarkUnavailable(
    slot: AppointmentSlot,
  ): PolicyDecision {
    if (slot.status === "booked") {
      return {
        allowed: false,
        reason:
          "Booked slots cannot become unavailable.",
      };
    }

    return { allowed: true };
  }

  static canMakeAvailable(
    slot: AppointmentSlot,
  ): PolicyDecision {
    if (slot.status === "booked") {
      return {
        allowed: false,
        reason:
          "Booked slots cannot become available.",
      };
    }

    return { allowed: true };
  }

  static reservationExpired(
    slot: AppointmentSlot,
    now: Date = new Date(),
  ): boolean {
    const expiry =
      slot.reservation.reservedUntil;

    if (!expiry) {
      return false;
    }

    return expiry <= now;
  }

  static isAvailable(
    slot: AppointmentSlot,
  ): boolean {
    return slot.status === "available";
  }

  static isReserved(
    slot: AppointmentSlot,
  ): boolean {
    return slot.status === "reserved";
  }

  static isBooked(
    slot: AppointmentSlot,
  ): boolean {
    return slot.status === "booked";
  }

  static isBlocked(
    slot: AppointmentSlot,
  ): boolean {
    return slot.status === "blocked";
  }

  static isUnavailable(
    slot: AppointmentSlot,
  ): boolean {
    return slot.status === "unavailable";
  }
}