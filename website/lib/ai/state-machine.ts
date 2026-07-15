// website/lib/ai/state-machine.ts

import type {
  AIConversationSession,
  AIConversationState,
} from "./core";

import {
  getMissingAppointmentFields,
} from "./conversation-utils";

/**
 * ============================================================
 * PatientPilot AI
 * Conversation State Machine
 * ============================================================
 */

export interface StateTransition {
  from: AIConversationState;
  to: AIConversationState;
  reason: string;
}

export interface StateMachineResult {
  currentState: AIConversationState;
  nextState: AIConversationState;
  completed: boolean;
  transition?: StateTransition;
}

/**
 * Ordered workflow.
 */
const WORKFLOW: AIConversationState[] = [
  "greeting",
  "collecting_name",
  "collecting_phone",
  "collecting_reason",
  "collecting_date",
  "confirming",
  "completed",
];

/**
 * Returns the next sequential workflow state.
 */
function getSequentialState(
  state: AIConversationState,
): AIConversationState {
  const index = WORKFLOW.indexOf(state);

  if (
    index < 0 ||
    index === WORKFLOW.length - 1
  ) {
    return state;
  }

  return WORKFLOW[index + 1];
}

/**
 * Core state transition engine.
 */
export function evaluateState(
  session: AIConversationSession,
): StateMachineResult {
  const current = session.state;

  const appointment = session.appointment;

  let next = current;

  switch (current) {
    case "idle":
      next = "greeting";
      break;

    case "greeting":
      next = "collecting_name";
      break;

    case "collecting_name":
      if (appointment.patientName) {
        next = "collecting_phone";
      }
      break;

    case "collecting_phone":
      if (appointment.phoneNumber) {
        next = "collecting_reason";
      }
      break;

    case "collecting_reason":
      if (
        appointment.reason ||
        appointment.procedure
      ) {
        next = "collecting_date";
      }
      break;

    case "collecting_date":
      if (
        appointment.preferredDate &&
        appointment.preferredTime
      ) {
        next = "confirming";
      }
      break;

    case "confirming":
      if (
        appointment.confirmed &&
        getMissingAppointmentFields(
          appointment,
        ).length === 0
      ) {
        next = "completed";
      }
      break;

    case "handoff":
      next = "ended";
      break;

    case "completed":
      next = "ended";
      break;

    case "ended":
      next = "ended";
      break;
  }

  return {
    currentState: current,

    nextState: next,

    completed:
      next === "completed" ||
      next === "ended",

    transition:
      current === next
        ? undefined
        : {
            from: current,
            to: next,
            reason: `${current} → ${next}`,
          },
  };
}

/**
 * True if the workflow can move forward.
 */
export function canAdvance(
  session: AIConversationSession,
): boolean {
  const result =
    evaluateState(session);

  return (
    result.currentState !==
    result.nextState
  );
}

/**
 * Force a transition.
 */
export function forceState(
  session: AIConversationSession,
  state: AIConversationState,
): StateMachineResult {
  return {
    currentState: session.state,

    nextState: state,

    completed:
      state === "completed" ||
      state === "ended",

    transition: {
      from: session.state,
      to: state,
      reason: "Forced transition",
    },
  };
}

/**
 * Remaining workflow.
 */
export function remainingStates(
  session: AIConversationSession,
): AIConversationState[] {
  const index =
    WORKFLOW.indexOf(session.state);

  if (index < 0) {
    return [];
  }

  return WORKFLOW.slice(index + 1);
}

/**
 * Terminal workflow states.
 */
export function isTerminalState(
  state: AIConversationState,
): boolean {
  return (
    state === "completed" ||
    state === "ended"
  );
}