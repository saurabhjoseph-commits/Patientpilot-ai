/**
 * ============================================================
 * PatientPilot AI
 * Register Clinic Use Case
 * ============================================================
 */

import type { UseCase } from "../../common/UseCase";
import type { ApplicationContext } from "../../common/ApplicationContext";
import type { ApplicationResult } from "../../common/ApplicationResult";

import type { RegisterClinicRequest } from "./RegisterClinicRequest";
import type { RegisterClinicResponse } from "./RegisterClinicResponse";

export class RegisterClinicUseCase
  implements
    UseCase<
      RegisterClinicRequest,
      RegisterClinicResponse
    >
{
  async execute(
    context: ApplicationContext,
    request: RegisterClinicRequest,
  ): Promise<
    ApplicationResult<RegisterClinicResponse>
  > {
    throw new Error(
      "RegisterClinicUseCase is not implemented.",
    );
  }
}