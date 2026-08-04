/**
 * ============================================================
 * PatientPilot AI
 * Register Clinic Validator
 * ============================================================
 *
 * Validates RegisterClinicRequest before the use case executes.
 */

import type { ValidationFailure } from "../../pipeline/ValidationBehavior";
import type { RequestValidator } from "../../pipeline/ValidationBehavior";

import type { ApplicationContext } from "../../common/ApplicationContext";
import type { RegisterClinicRequest } from "./RegisterClinicRequest";

export class RegisterClinicValidator
  implements RequestValidator
{
  async validate(
    request: RegisterClinicRequest,
    _context: ApplicationContext,
  ): Promise<ValidationFailure[]> {
    const failures: ValidationFailure[] = [];

    if (!request.name?.trim()) {
      failures.push({
        field: "name",
        message: "Clinic name is required.",
      });
    }

    if (!request.slug?.trim()) {
      failures.push({
        field: "slug",
        message: "Clinic slug is required.",
      });
    }

    if (!request.email?.trim()) {
      failures.push({
        field: "email",
        message: "Clinic email is required.",
      });
    }

    if (!request.country?.trim()) {
      failures.push({
        field: "country",
        message: "Country is required.",
      });
    }

    if (!request.timezone?.trim()) {
      failures.push({
        field: "timezone",
        message: "Timezone is required.",
      });
    }

    if (!request.administrator) {
      failures.push({
        field: "administrator",
        message: "Administrator information is required.",
      });

      return failures;
    }

    if (!request.administrator.fullName?.trim()) {
      failures.push({
        field: "administrator.fullName",
        message: "Administrator name is required.",
      });
    }

    if (!request.administrator.email?.trim()) {
      failures.push({
        field: "administrator.email",
        message: "Administrator email is required.",
      });
    }

    if (!request.administrator.password?.trim()) {
      failures.push({
        field: "administrator.password",
        message: "Administrator password is required.",
      });
    }

    return failures;
  }
}