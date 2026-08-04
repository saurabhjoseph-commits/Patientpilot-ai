/**
 * ============================================================
 * PatientPilot AI
 * Authorization Behavior
 * ============================================================
 *
 * Pipeline behavior responsible for authorizing commands
 * and queries before they reach a use case.
 */

import type { ApplicationContext } from "../common/ApplicationContext";
import type { PipelineBehavior } from "./PipelineBehavior";
import { AuthorizationErrorFactory } from "../errors/AuthorizationError";

export interface AuthorizationRequirement {
  readonly authenticated?: boolean;

  readonly permissions?: readonly string[];

  readonly roles?: readonly string[];

  readonly tenantScoped?: boolean;
}

export interface AuthorizationResult {
  readonly authorized: boolean;

  readonly error?: ReturnType<
    typeof AuthorizationErrorFactory.unauthenticated
  >;
}

export interface Authorizer {
  authorize(
    context: ApplicationContext,
    request: unknown,
  ): Promise<AuthorizationResult>;
}

export class AuthorizationBehavior
  implements PipelineBehavior
{
  constructor(
    private readonly authorizer: Authorizer,
  ) {}

  async beforeExecute(
    context: ApplicationContext,
    request: unknown,
  ): Promise<void> {
    const result = await this.authorizer.authorize(
      context,
      request,
    );

    if (result.authorized) {
      return;
    }

    throw (
      result.error ??
      AuthorizationErrorFactory.forbidden()
    );
  }
}