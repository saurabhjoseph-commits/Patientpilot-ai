import type {
  AIConversationSession,
  AIConversationState,
} from "./types";

import {
  getMissingAppointmentFields,
} from "./conversation";

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
  transition?: StateTransition;
  completed: boolean;
}

const STATE_ORDER: AIConversationState[] = [
  "greeting",
  "collecting_name",
  "collecting_phone",
  "collecting_reason",
  "collecting_date",
  "confirming",
  "completed",
];

function nextSequentialState(
  state: AIConversationState
): AIConversationState {
  const index = STATE_ORDER.indexOf(state);

  if (
    index === -1 ||
    index === STATE_ORDER.length - 1
  ) {
    return state;
  }

  return STATE_ORDER[index + 1];
}

/**
 * Determine the next conversation state.
 */
export function evaluateState(
  session: AIConversationSession
): StateMachineResult {
  const currentState = session.state;

  const appointment = session.appointment;

  let nextState: AIConversationState = currentState;

  switch (currentState) {
    case "idle":
      nextState = "greeting";
      break;

    case "greeting":
      nextState = "collecting_name";
      break;

    case "collecting_name":
      if (appointment.patientName) {
        nextState = "collecting_phone";
      }
      break;

    case "collecting_phone":
      if (appointment.phoneNumber) {
        nextState = "collecting_reason";
      }
      break;

    case "collecting_reason":
      if (appointment.reason) {
        nextState = "collecting_date";
      }
      break;

    case "collecting_date":
      if (
        appointment.appointmentDate &&
        appointment.appointmentTime
      ) {
        nextState = "confirming";
      }
      break;

    case "confirming":
      if (
        getMissingAppointmentFields(
          appointment
        ).length === 0
      ) {
        nextState = "completed";
      }
      break;

    case "completed":
      nextState = "ended";
      break;

    case "handoff":
      nextState = "ended";
      break;

    case "ended":
      nextState = "ended";
      break;
  }

  const completed =
    nextState === "completed" ||
    nextState === "ended";

  return {
    currentState,
    nextState,
    completed,
    transition:
      currentState === nextState
        ? undefined
        : {
            from: currentState,
            to: nextState,
            reason: buildReason(
              currentState,
              nextState
            ),
          },
  };
}

/**
 * Returns true if the state
 * should move immediately.
 */
export function canAdvance(
  session: AIConversationSession
): boolean {
  return (
    evaluateState(session).currentState !==
    evaluateState(session).nextState
  );
}

/**
 * Force a state transition.
 */
export function forceState(
  session: AIConversationSession,
  state: AIConversationState
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
 * Returns remaining steps.
 */
export function remainingStates(
  session: AIConversationSession
): AIConversationState[] {
  const index = STATE_ORDER.indexOf(
    session.state
  );

  if (index < 0) {
    return [];
  }

  return STATE_ORDER.slice(index + 1);
}

/**
 * Human-readable transition reason.
 */
function buildReason(
  from: AIConversationState,
  to: AIConversationState
): string {
  if (to === nextSequentialState(from)) {
    return "Conversation progressed";
  }

  return `${from} → ${to}`;
}