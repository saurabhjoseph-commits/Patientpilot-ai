/**
 * ============================================================
 * PatientPilot AI
 * Validation Behavior
 * ============================================================
 *
 * Pipeline behavior responsible for validating incoming
 * commands and queries before they reach a use case.
 */

import type { ApplicationContext } from "../common/ApplicationContext";
import type { PipelineBehavior } from "./PipelineBehavior";
import { ValidationErrorFactory } from "../errors/ValidationError";

export interface ValidationFailure {
  field: string;

  message: string;

  code?: string;

  attemptedValue?: unknown;
}

export interface RequestValidator {
  validate(
    request: unknown,
    context: ApplicationContext,
  ): Promise<ValidationFailure[]>;
}

export class ValidationBehavior
  implements PipelineBehavior
{
  constructor(
    private readonly validator: RequestValidator,
  ) {}

  async beforeExecute(
    context: ApplicationContext,
    request: unknown,
  ): Promise<void> {
    const failures = await this.validator.validate(
      request,
      context,
    );

    if (failures.length === 0) {
      return;
    }

    throw ValidationErrorFactory.create(failures);
  }
}