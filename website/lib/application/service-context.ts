/**
 * PatientPilot AI
 * Application Layer
 * Service Context
 *
 * Shared dependency container for application services.
 */

import {
  providerService,
  ProviderService,
} from "./provider-service";

import {
  eventDispatcher,
  EventDispatcher,
} from "@/lib/infrastructure/events/event-dispatcher";

import {
  unitOfWork,
  UnitOfWork,
} from "@/lib/infrastructure/repositories/unit-of-work";

export interface ServiceContext {
  readonly providers: ProviderService;
  readonly events: EventDispatcher;
  readonly unitOfWork: UnitOfWork;
}

export class DefaultServiceContext
  implements ServiceContext
{
  readonly providers = providerService;

  readonly events = eventDispatcher;

  readonly unitOfWork = unitOfWork;
}

/**
 * Creates a Service Context.
 */
export function createServiceContext(): ServiceContext {
  return new DefaultServiceContext();
}

/**
 * Shared Service Context.
 */
export const serviceContext =
  createServiceContext();

export default serviceContext;