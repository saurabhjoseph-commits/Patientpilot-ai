/**
 * ============================================================
 * PatientPilot AI
 * Referral Aggregate Root
 * ============================================================
 */

import {
  Referral,
  ReferralCampaign,
  ReferralConversion,
  ReferralRecipient,
  ReferralReferrer,
  ReferralStatus,
} from "./referral.types";

export interface CreateReferralParams {
  id: string;
  tenantId: string;
  referrer: ReferralReferrer;
  recipient: ReferralRecipient;
  campaign?: Partial<ReferralCampaign>;
}

export class ReferralAggregate {
  static create(
    params: CreateReferralParams,
  ): Referral {
    const now = new Date();

    return {
      id: params.id,

      tenantId: params.tenantId,

      referrer: params.referrer,

      recipient: params.recipient,

      campaign: {
        id: params.campaign?.id,
        name: params.campaign?.name,
        source: params.campaign?.source ?? "patient",
      },

      conversion: defaultConversion(),

      status: "pending",

      notes: undefined,

      createdAt: now,

      updatedAt: now,
    };
  }

  static updateStatus(
    referral: Referral,
    status: ReferralStatus,
  ): Referral {
    return {
      ...referral,
      status,
      updatedAt: new Date(),
    };
  }

  static updateCampaign(
    referral: Referral,
    campaign: Partial<ReferralCampaign>,
  ): Referral {
    return {
      ...referral,
      campaign: {
        ...referral.campaign,
        ...campaign,
      },
      updatedAt: new Date(),
    };
  }

  static updateRecipient(
    referral: Referral,
    recipient: Partial<ReferralRecipient>,
  ): Referral {
    return {
      ...referral,
      recipient: {
        ...referral.recipient,
        ...recipient,
      },
      updatedAt: new Date(),
    };
  }

  static updateConversion(
    referral: Referral,
    conversion: Partial<ReferralConversion>,
  ): Referral {
    return {
      ...referral,
      conversion: {
        ...referral.conversion,
        ...conversion,
      },
      updatedAt: new Date(),
    };
  }

  static addNotes(
    referral: Referral,
    notes?: string,
  ): Referral {
    return {
      ...referral,
      notes,
      updatedAt: new Date(),
    };
  }
}

function defaultConversion(): ReferralConversion {
  return {
    qualified: false,
    converted: false,
    qualifiedAt: undefined,
    convertedAt: undefined,
    firstAppointmentId: undefined,
    dealId: undefined,
  };
}