// website/lib/ai/tools/mapper.ts

import { getClinicContext } from "@/lib/ai/context";

import type { AIConversationSession } from "@/lib/ai/core/session";

import type { AIToolName } from "./types";

import type {
  CreateAppointmentInput,
} from "@/lib/appointments/types";

import type {
  CreatePatientInput,
} from "@/lib/patients/types";

import type {
  CreateLeadRequest,
} from "@/lib/leads/types";

/**
 * ============================================================
 * PatientPilot AI
 * Tool Mapper
 * ============================================================
 *
 * Converts the AI conversation session into the
 * input models required by the business services.
 *
 * No validation.
 * No database access.
 * No business logic.
 * ============================================================
 */

export function mapAppointmentInput(
  session: AIConversationSession,
): CreateAppointmentInput {
  const clinic = getClinicContext();

  return {
    clinicName: clinic.name,

    patientName:
      session.patient.fullName ?? "",

    phoneNumber:
      session.patient.phone ?? "",

    appointmentDate:
      session.appointment.appointmentDate ?? "",

    appointmentTime:
      session.appointment.appointmentTime ?? "",

    reason:
      session.appointment.reason ?? "",

    callSid:
      session.callId,
  };
}

export function mapPatientInput(
  session: AIConversationSession,
): CreatePatientInput {
  const clinic = getClinicContext();

  const fullName =
    session.patient.fullName?.trim() ?? "";

  const parts = fullName.split(/\s+/);

  const firstName =
    parts[0] ?? "";

  const lastName =
    parts.length > 1
      ? parts.slice(1).join(" ")
      : "";

  return {
    clinicName: clinic.name,

    firstName,

    lastName,

    phoneNumber:
      session.patient.phone ?? "",

    email:
      session.patient.email ?? "",
  };
}

export function mapLeadInput(
  session: AIConversationSession,
): CreateLeadRequest {
  const clinic = getClinicContext();

  return {
    clinicName:
      clinic.name,

    dentistName:
      session.patient.fullName ?? "",

    email:
      session.patient.email ?? "",

    phone:
      session.patient.phone ?? "",

    monthlyCalls: 0,

    message:
      session.appointment.reason ?? "",
  };
}

/**
 * ============================================================
 * Workflow Execution
 * ============================================================
 */

export interface WorkflowExecution {
  tool: AIToolName;
  input: unknown;
}

/**
 * Selects the appropriate mapper for the requested workflow tool.
 *
 * The conversation service should never know how to build
 * tool-specific input models. That responsibility belongs here.
 */
export function mapWorkflowExecution(
  tool: AIToolName,
  session: AIConversationSession,
): WorkflowExecution {
  switch (tool) {
    case "appointment.create":
      return {
        tool,
        input: mapAppointmentInput(session),
      };

    case "patient.createOrUpdate":
      return {
        tool,
        input: mapPatientInput(session),
      };

    case "lead.create":
      return {
        tool,
        input: mapLeadInput(session),
      };

    default:
      throw new Error(
        `No workflow mapper registered for tool: ${tool}`,
      );
  }
}