/**
 * ============================================================
 * PatientPilot AI
 * Register User Response
 * ============================================================
 *
 * Returned after successfully registering a user.
 */

export interface RegisterUserResponse {
  /**
   * Newly created user identifier.
   */
  readonly userId: string;

  /**
   * Clinic the user belongs to.
   */
  readonly clinicId: string;

  /**
   * Assigned application role.
   */
  readonly roleCode: string;

  /**
   * Whether an invitation email was sent.
   */
  readonly invitationSent: boolean;

  /**
   * Indicates the operation completed successfully.
   */
  readonly success: true;
}