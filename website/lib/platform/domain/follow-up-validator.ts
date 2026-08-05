// website/lib/platform/domain/follow-up-validator.ts

import type {
  FollowUp,
  FollowUpChannel,
  RetryPolicy,
} from "./follow-up.types";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX =
  /^\+?[1-9]\d{7,15}$/;

export class FollowUpValidator {
  validate(
    followUp: FollowUp,
  ): ValidationResult {
    const errors: ValidationError[] = [];

    errors.push(
      ...this.validateRecipient(followUp),
    );

    errors.push(
      ...this.validateContent(followUp),
    );

    errors.push(
      ...this.validateSchedule(followUp),
    );

    errors.push(
      ...this.validateRetryPolicy(
        followUp.retryPolicy,
      ),
    );

    errors.push(
      ...this.validateMetadata(followUp),
    );

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateRecipient(
    followUp: FollowUp,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    const recipient =
      followUp.recipient;

    if (
      !recipient.patientId &&
      !recipient.leadId
    ) {
      errors.push({
        field: "recipient",
        message:
          "Recipient must contain either patientId or leadId.",
      });
    }

    switch (followUp.channel) {
      case "sms":
      case "voice":
      case "whatsapp":
        if (
          !recipient.phone ||
          !PHONE_REGEX.test(
            recipient.phone,
          )
        ) {
          errors.push({
            field: "recipient.phone",
            message:
              "A valid phone number is required.",
          });
        }
        break;

      case "email":
        if (
          !recipient.email ||
          !EMAIL_REGEX.test(
            recipient.email,
          )
        ) {
          errors.push({
            field: "recipient.email",
            message:
              "A valid email address is required.",
          });
        }
        break;

      case "push":
        break;
    }

    return errors;
  }

  validateContent(
    followUp: FollowUp,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    const message =
      followUp.content.message.trim();

    if (message.length === 0) {
      errors.push({
        field: "content.message",
        message:
          "Message cannot be empty.",
      });
    }

    if (message.length > 5000) {
      errors.push({
        field: "content.message",
        message:
          "Message exceeds maximum length.",
      });
    }

    if (
      followUp.channel === "email" &&
      !followUp.content.subject
    ) {
      errors.push({
        field: "content.subject",
        message:
          "Email subject is required.",
      });
    }

    return errors;
  }

  validateSchedule(
    followUp: FollowUp,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    const {
      scheduledAt,
      timezone,
    } = followUp.schedule;

    if (
      !(scheduledAt instanceof Date)
    ) {
      errors.push({
        field: "schedule.scheduledAt",
        message:
          "Invalid scheduled date.",
      });

      return errors;
    }

    if (
      Number.isNaN(
        scheduledAt.getTime(),
      )
    ) {
      errors.push({
        field: "schedule.scheduledAt",
        message:
          "Invalid scheduled date.",
      });
    }

    if (
      timezone.trim().length === 0
    ) {
      errors.push({
        field: "schedule.timezone",
        message:
          "Timezone is required.",
      });
    }

    return errors;
  }

  validateRetryPolicy(
    retry: RetryPolicy,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!retry.enabled) {
      return errors;
    }

    if (retry.maxAttempts < 1) {
      errors.push({
        field: "retry.maxAttempts",
        message:
          "Retry attempts must be greater than zero.",
      });
    }

    if (
      retry.retryIntervalMinutes < 1
    ) {
      errors.push({
        field:
          "retry.retryIntervalMinutes",
        message:
          "Retry interval must be greater than zero.",
      });
    }

    return errors;
  }

  validateMetadata(
    followUp: FollowUp,
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (
      !followUp.metadata.tenantId
    ) {
      errors.push({
        field: "metadata.tenantId",
        message:
          "Tenant ID is required.",
      });
    }

    if (
      !followUp.metadata.clinicId
    ) {
      errors.push({
        field: "metadata.clinicId",
        message:
          "Clinic ID is required.",
      });
    }

    return errors;
  }

  validateChannel(
    channel: FollowUpChannel,
  ): boolean {
    return [
      "sms",
      "email",
      "voice",
      "whatsapp",
      "push",
    ].includes(channel);
  }

  throwIfInvalid(
    followUp: FollowUp,
  ): void {
    const result =
      this.validate(followUp);

    if (!result.valid) {
      throw new Error(
        result.errors
          .map(
            (e) =>
              `${e.field}: ${e.message}`,
          )
          .join("\n"),
      );
    }
  }
}

export const followUpValidator =
  new FollowUpValidator();