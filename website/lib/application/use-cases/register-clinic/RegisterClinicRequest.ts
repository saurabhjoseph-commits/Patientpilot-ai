/**
 * ============================================================
 * PatientPilot AI
 * Register Clinic Request
 * ============================================================
 *
 * Command for registering a new clinic.
 */

import type { Command } from "../../common/Command";

export interface RegisterClinicRequest extends Command {
  readonly type: "RegisterClinic";

  readonly name: string;

  readonly slug: string;

  readonly email: string;

  readonly phone?: string;

  readonly website?: string;

  readonly address?: string;

  readonly city?: string;

  readonly state?: string;

  readonly country: string;

  readonly timezone: string;

  readonly administrator: {
    readonly fullName: string;

    readonly email: string;

    readonly password: string;
  };
}