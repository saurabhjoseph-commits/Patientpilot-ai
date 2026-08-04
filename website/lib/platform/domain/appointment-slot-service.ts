/**
 * ============================================================
 * PatientPilot AI
 * Appointment Slot Service
 * ============================================================
 */

import {
  AppointmentSlot,
  AppointmentSlotReservation,
  AppointmentSlotStatus,
} from "./appointment-slot.types";

import {
  validateAppointmentSlot,
  ValidationResult,
} from "./appointment-slot-validator";

import {
  AppointmentSlotPolicy,
  PolicyDecision,
} from "./appointment-slot-policy";

export class AppointmentSlotService {
  validate(
    slot: AppointmentSlot,
  ): ValidationResult {
    return validateAppointmentSlot(slot);
  }

  canReserve(
    slot: AppointmentSlot,
  ): PolicyDecision {
    return AppointmentSlotPolicy.canReserve(slot);
  }

  canBook(
    slot: AppointmentSlot,
  ): PolicyDecision {
    return AppointmentSlotPolicy.canBook(slot);
  }

  canRelease(
    slot: AppointmentSlot,
  ): PolicyDecision {
    return AppointmentSlotPolicy.canRelease(slot);
  }

  canBlock(
    slot: AppointmentSlot,
  ): PolicyDecision {
    return AppointmentSlotPolicy.canBlock(slot);
  }

  canUnblock(
    slot: AppointmentSlot,
  ): PolicyDecision {
    return AppointmentSlotPolicy.canUnblock(slot);
  }

  canMarkUnavailable(
    slot: AppointmentSlot,
  ): PolicyDecision {
    return AppointmentSlotPolicy.canMarkUnavailable(slot);
  }

  canMakeAvailable(
    slot: AppointmentSlot,
  ): PolicyDecision {
    return AppointmentSlotPolicy.canMakeAvailable(slot);
  }

  reserve(
    slot: AppointmentSlot,
    reservation: AppointmentSlotReservation,
  ): AppointmentSlot {
    return {
      ...slot,
      status: "reserved",
      reservation,
      updatedAt: new Date(),
    };
  }

  book(
    slot: AppointmentSlot,
    appointmentId: string,
  ): AppointmentSlot {
    return {
      ...slot,
      status: "booked",
      reservation: {
        ...slot.reservation,
        appointmentId,
        reservedUntil: undefined,
      },
      updatedAt: new Date(),
    };
  }

  release(
    slot: AppointmentSlot,
  ): AppointmentSlot {
    return {
      ...slot,
      status: "available",
      reservation: {},
      updatedAt: new Date(),
    };
  }

  block(
    slot: AppointmentSlot,
  ): AppointmentSlot {
    return {
      ...slot,
      status: "blocked",
      reservation: {},
      updatedAt: new Date(),
    };
  }

  unblock(
    slot: AppointmentSlot,
  ): AppointmentSlot {
    return {
      ...slot,
      status: "available",
      reservation: {},
      updatedAt: new Date(),
    };
  }

  markUnavailable(
    slot: AppointmentSlot,
  ): AppointmentSlot {
    return {
      ...slot,
      status: "unavailable",
      reservation: {},
      updatedAt: new Date(),
    };
  }

  makeAvailable(
    slot: AppointmentSlot,
  ): AppointmentSlot {
    return {
      ...slot,
      status: "available",
      reservation: {},
      updatedAt: new Date(),
    };
  }

  updateStatus(
    slot: AppointmentSlot,
    status: AppointmentSlotStatus,
  ): AppointmentSlot {
    return {
      ...slot,
      status,
      updatedAt: new Date(),
    };
  }

  reservationExpired(
    slot: AppointmentSlot,
    now?: Date,
  ): boolean {
    return AppointmentSlotPolicy.reservationExpired(
      slot,
      now,
    );
  }

  isAvailable(
    slot: AppointmentSlot,
  ): boolean {
    return AppointmentSlotPolicy.isAvailable(slot);
  }

  isReserved(
    slot: AppointmentSlot,
  ): boolean {
    return AppointmentSlotPolicy.isReserved(slot);
  }

  isBooked(
    slot: AppointmentSlot,
  ): boolean {
    return AppointmentSlotPolicy.isBooked(slot);
  }

  isBlocked(
    slot: AppointmentSlot,
  ): boolean {
    return AppointmentSlotPolicy.isBlocked(slot);
  }

  isUnavailable(
    slot: AppointmentSlot,
  ): boolean {
    return AppointmentSlotPolicy.isUnavailable(slot);
  }
}

export const appointmentSlotService =
  new AppointmentSlotService();