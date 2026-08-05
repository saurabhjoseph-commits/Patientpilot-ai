/**
 * ============================================================
 * PatientPilot AI
 * Appointment Slot Aggregate
 * ============================================================
 */

import {
  AppointmentSlot,
  AppointmentSlotReservation,
} from "./appointment-slot.types";

import { appointmentSlotService } from "./appointment-slot-service";

export class AppointmentSlotAggregate {
  constructor(
    private readonly slot: AppointmentSlot,
  ) {}

  static create(
    slot: AppointmentSlot,
  ): AppointmentSlotAggregate {
    const validation =
      appointmentSlotService.validate(slot);

    if (!validation.valid) {
      throw new Error(
        validation.errors.join("\n"),
      );
    }

    return new AppointmentSlotAggregate(
      slot,
    );
  }

  get value(): AppointmentSlot {
    return this.slot;
  }

  reserve(
    reservation: AppointmentSlotReservation,
  ): AppointmentSlotAggregate {
    const decision =
      appointmentSlotService.canReserve(
        this.slot,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new AppointmentSlotAggregate(
      appointmentSlotService.reserve(
        this.slot,
        reservation,
      ),
    );
  }

  book(
    appointmentId: string,
  ): AppointmentSlotAggregate {
    const decision =
      appointmentSlotService.canBook(
        this.slot,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new AppointmentSlotAggregate(
      appointmentSlotService.book(
        this.slot,
        appointmentId,
      ),
    );
  }

  release(): AppointmentSlotAggregate {
    const decision =
      appointmentSlotService.canRelease(
        this.slot,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new AppointmentSlotAggregate(
      appointmentSlotService.release(
        this.slot,
      ),
    );
  }

  block(): AppointmentSlotAggregate {
    const decision =
      appointmentSlotService.canBlock(
        this.slot,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new AppointmentSlotAggregate(
      appointmentSlotService.block(
        this.slot,
      ),
    );
  }

  unblock(): AppointmentSlotAggregate {
    const decision =
      appointmentSlotService.canUnblock(
        this.slot,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new AppointmentSlotAggregate(
      appointmentSlotService.unblock(
        this.slot,
      ),
    );
  }

  markUnavailable(): AppointmentSlotAggregate {
    const decision =
      appointmentSlotService.canMarkUnavailable(
        this.slot,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new AppointmentSlotAggregate(
      appointmentSlotService.markUnavailable(
        this.slot,
      ),
    );
  }

  makeAvailable(): AppointmentSlotAggregate {
    const decision =
      appointmentSlotService.canMakeAvailable(
        this.slot,
      );

    if (!decision.allowed) {
      throw new Error(
        decision.reason,
      );
    }

    return new AppointmentSlotAggregate(
      appointmentSlotService.makeAvailable(
        this.slot,
      ),
    );
  }

  isAvailable(): boolean {
    return appointmentSlotService.isAvailable(
      this.slot,
    );
  }

  isReserved(): boolean {
    return appointmentSlotService.isReserved(
      this.slot,
    );
  }

  isBooked(): boolean {
    return appointmentSlotService.isBooked(
      this.slot,
    );
  }

  isBlocked(): boolean {
    return appointmentSlotService.isBlocked(
      this.slot,
    );
  }

  isUnavailable(): boolean {
    return appointmentSlotService.isUnavailable(
      this.slot,
    );
  }

  reservationExpired(
    now?: Date,
  ): boolean {
    return appointmentSlotService.reservationExpired(
      this.slot,
      now,
    );
  }
}