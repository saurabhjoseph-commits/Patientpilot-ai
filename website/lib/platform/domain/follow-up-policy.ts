// website/lib/platform/domain/follow-up-policy.ts

import type {
  FollowUp,
  FollowUpChannel,
  FollowUpPriority,
  FollowUpStatus,
} from "./follow-up.types";

/**
 * PatientPilot AI
 * Follow-up Business Policy Engine
 *
 * Pure business rules.
 * No database.
 * No provider integrations.
 * No infrastructure dependencies.
 */

export interface QuietHoursPolicy {
  enabled: boolean;
  startHour: number;
  endHour: number;
  timezone: string;
}

export interface BusinessHoursPolicy {
  enabled: boolean;
  startHour: number;
  endHour: number;
  allowWeekends: boolean;
}

export interface RetryPolicyConfiguration {
  enabled: boolean;
  maxAttempts: number;
  retryDelayMinutes: number;
}

export interface FollowUpPolicyConfiguration {
  allowedChannels: FollowUpChannel[];

  quietHours: QuietHoursPolicy;

  businessHours: BusinessHoursPolicy;

  retry: RetryPolicyConfiguration;

  allowManualExecution: boolean;

  allowImmediateExecution: boolean;
}

export const DEFAULT_FOLLOW_UP_POLICY: FollowUpPolicyConfiguration = {
  allowedChannels: [
    "sms",
    "email",
    "voice",
    "whatsapp",
  ],

  quietHours: {
    enabled: true,
    startHour: 21,
    endHour: 8,
    timezone: "UTC",
  },

  businessHours: {
    enabled: false,
    startHour: 8,
    endHour: 18,
    allowWeekends: false,
  },

  retry: {
    enabled: true,
    maxAttempts: 3,
    retryDelayMinutes: 15,
  },

  allowManualExecution: true,

  allowImmediateExecution: true,
};

export class FollowUpPolicy {
  constructor(
    private readonly configuration: FollowUpPolicyConfiguration = DEFAULT_FOLLOW_UP_POLICY,
  ) {}

  getConfiguration(): FollowUpPolicyConfiguration {
    return this.configuration;
  }

  isChannelAllowed(
    channel: FollowUpChannel,
  ): boolean {
    return this.configuration.allowedChannels.includes(channel);
  }

  canExecuteStatus(
    status: FollowUpStatus,
  ): boolean {
    return (
      status === "scheduled" ||
      status === "queued"
    );
  }

  canRetry(
    attempt: number,
  ): boolean {
    if (!this.configuration.retry.enabled) {
      return false;
    }

    return (
      attempt <
      this.configuration.retry.maxAttempts
    );
  }

  retryDelayMinutes(): number {
    return this.configuration.retry.retryDelayMinutes;
  }

  canExecuteImmediately(): boolean {
    return this.configuration.allowImmediateExecution;
  }

  canExecuteManually(): boolean {
    return this.configuration.allowManualExecution;
  }

  isPriorityValid(
    priority: FollowUpPriority,
  ): boolean {
    return [
      "low",
      "normal",
      "high",
      "critical",
    ].includes(priority);
  }

  isReadyForExecution(
    followUp: FollowUp,
  ): boolean {
    if (
      !this.isChannelAllowed(
        followUp.channel,
      )
    ) {
      return false;
    }

    if (
      !this.canExecuteStatus(
        followUp.status,
      )
    ) {
      return false;
    }

    return true;
  }

  isWithinQuietHours(
    date: Date,
  ): boolean {
    if (
      !this.configuration.quietHours.enabled
    ) {
      return false;
    }

    const hour = date.getHours();

    const {
      startHour,
      endHour,
    } = this.configuration.quietHours;

    if (startHour > endHour) {
      return (
        hour >= startHour ||
        hour < endHour
      );
    }

    return (
      hour >= startHour &&
      hour < endHour
    );
  }

  isWithinBusinessHours(
    date: Date,
  ): boolean {
    if (
      !this.configuration.businessHours.enabled
    ) {
      return true;
    }

    const day = date.getDay();

    if (
      !this.configuration.businessHours.allowWeekends &&
      (day === 0 || day === 6)
    ) {
      return false;
    }

    const hour = date.getHours();

    return (
      hour >=
        this.configuration.businessHours.startHour &&
      hour <
        this.configuration.businessHours.endHour
    );
  }

  canSendNow(
    followUp: FollowUp,
    now: Date = new Date(),
  ): boolean {
    if (
      !this.isReadyForExecution(
        followUp,
      )
    ) {
      return false;
    }

    if (
      this.isWithinQuietHours(now)
    ) {
      return false;
    }

    if (
      !this.isWithinBusinessHours(
        now,
      )
    ) {
      return false;
    }

    return (
      followUp.schedule.sendImmediately ||
      followUp.schedule.scheduledAt <= now
    );
  }
}

export const followUpPolicy =
  new FollowUpPolicy();