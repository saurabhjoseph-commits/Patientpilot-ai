// components/demo/live/status.ts

import type { DemoStage } from "./types";

export function getStageLabel(
  stage: DemoStage
): string {
  switch (stage) {
    case "idle":
      return "Waiting";

    case "ringing":
      return "Incoming Call";

    case "connected":
      return "Connected";

    case "conversation":
      return "Listening";

    case "thinking":
      return "AI Reasoning";

    case "booking":
      return "Booking Appointment";

    case "crm_update":
      return "Updating CRM";

    case "completed":
      return "Completed";
  }
}

export function getStageDescription(
  stage: DemoStage
): string {
  switch (stage) {
    case "idle":
      return "Ready to start the demonstration.";

    case "ringing":
      return "Incoming patient call.";

    case "connected":
      return "Greeting the patient.";

    case "conversation":
      return "Collecting patient information.";

    case "thinking":
      return "Analyzing the conversation.";

    case "booking":
      return "Creating the appointment.";

    case "crm_update":
      return "Synchronizing practice records.";

    case "completed":
      return "Demo completed successfully.";
  }
}

export function getStageColor(
  stage: DemoStage
): string {
  switch (stage) {
    case "completed":
      return "emerald";

    case "booking":
      return "blue";

    case "thinking":
      return "violet";

    case "crm_update":
      return "cyan";

    default:
      return "slate";
  }
}