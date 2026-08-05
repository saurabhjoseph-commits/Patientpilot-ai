// website/lib/platform/integration/index.ts

/**
 * PatientPilot AI
 * PP-006 Integration Layer
 *
 * Public exports.
 */

export * from "./domain-event";

/* Event Bus */
export {
  InMemoryEventBus,
  eventBus,
} from "./event-bus";

export type {
  EventBus,
  EventHandler as EventBusHandler,
} from "./event-bus";

/* Event Handlers */
export {
  BaseEventHandler,
  CompositeEventHandler,
} from "./event-handler";

export type {
  EventHandler,
} from "./event-handler";

/* Dispatchers */
export * from "./workflow-dispatcher";
export * from "./notification-dispatcher";
export * from "./followup-dispatcher";
export * from "./crm-dispatcher";
export * from "./ai-dispatcher";

/* Registry */
export * from "./integration-registry";