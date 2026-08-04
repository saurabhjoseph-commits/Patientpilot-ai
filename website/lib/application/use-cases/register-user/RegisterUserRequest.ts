/**
 * ============================================================
 * PatientPilot AI
 * Register User Request
 * ============================================================
 *
 * Command for registering a new user.
 */

import type { Command } from "../../common/Command";

export interface RegisterUserRequest extends Command {
  readonly type: "RegisterUser";

  /**
   * Clinic the user belongs to.
   */
  readonly clinicId: string;

  /**
   * User profile.
   */
  readonly fullName: string;

  readonly email: string;

  readonly password: string;

  readonly phone?: string;

  /**
   * Initial application role.
   *
   * Examples:
   * CLINIC_ADMIN
   * DENTIST
   * RECEPTIONIST
   * OFFICE_MANAGER
   */
  readonly roleCode: string;

  /**
   * Optional invitation flow.
   */
  readonly sendInvitation?: boolean;
}