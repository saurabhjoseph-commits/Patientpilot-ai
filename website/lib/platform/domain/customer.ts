/**
 * ============================================================
 * PatientPilot AI
 * Customer Aggregate Root
 * ============================================================
 */

import {
  Customer,
  CustomerFlags,
  CustomerInsurance,
  CustomerLoyaltyTier,
  CustomerMetrics,
  CustomerPreferences,
  CustomerRecall,
  CustomerRiskLevel,
  CustomerStatus,
} from "./customer.types";

export interface CreateCustomerParams {
  id: string;
  tenantId: string;
  leadId?: string;
  contactId?: string;
  externalId?: string;
}

export class CustomerAggregate {
  static create(
    params: CreateCustomerParams,
  ): Customer {
    const now = new Date();

    return {
      id: params.id,
      tenantId: params.tenantId,
      leadId: params.leadId,
      contactId: params.contactId,
      externalId: params.externalId,

      status: "active",

      riskLevel: "low",

      loyaltyTier: "none",

      metrics: defaultMetrics(),

      preferences: defaultPreferences(),

      recall: defaultRecall(),

      insurance: undefined,

      flags: defaultFlags(),

      tags: [],

      notes: undefined,

      createdAt: now,

      updatedAt: now,
    };
  }

  static updateStatus(
    customer: Customer,
    status: CustomerStatus,
  ): Customer {
    return {
      ...customer,
      status,
      updatedAt: new Date(),
    };
  }

  static updateRiskLevel(
    customer: Customer,
    riskLevel: CustomerRiskLevel,
  ): Customer {
    return {
      ...customer,
      riskLevel,
      updatedAt: new Date(),
    };
  }

  static updateLoyaltyTier(
    customer: Customer,
    loyaltyTier: CustomerLoyaltyTier,
  ): Customer {
    return {
      ...customer,
      loyaltyTier,
      updatedAt: new Date(),
    };
  }

  static updatePreferences(
    customer: Customer,
    preferences: Partial<CustomerPreferences>,
  ): Customer {
    return {
      ...customer,
      preferences: {
        ...customer.preferences,
        ...preferences,
      },
      updatedAt: new Date(),
    };
  }

  static updateInsurance(
    customer: Customer,
    insurance: CustomerInsurance,
  ): Customer {
    return {
      ...customer,
      insurance,
      updatedAt: new Date(),
    };
  }

  static updateRecall(
    customer: Customer,
    recall: Partial<CustomerRecall>,
  ): Customer {
    return {
      ...customer,
      recall: {
        ...customer.recall,
        ...recall,
      },
      updatedAt: new Date(),
    };
  }

  static updateFlags(
    customer: Customer,
    flags: Partial<CustomerFlags>,
  ): Customer {
    return {
      ...customer,
      flags: {
        ...customer.flags,
        ...flags,
      },
      updatedAt: new Date(),
    };
  }

  static addTag(
    customer: Customer,
    tag: string,
  ): Customer {
    if (customer.tags.includes(tag)) {
      return customer;
    }

    return {
      ...customer,
      tags: [...customer.tags, tag],
      updatedAt: new Date(),
    };
  }

  static removeTag(
    customer: Customer,
    tag: string,
  ): Customer {
    return {
      ...customer,
      tags: customer.tags.filter(
        (t) => t !== tag,
      ),
      updatedAt: new Date(),
    };
  }

  static updateNotes(
    customer: Customer,
    notes?: string,
  ): Customer {
    return {
      ...customer,
      notes,
      updatedAt: new Date(),
    };
  }

  static updateMetrics(
    customer: Customer,
    metrics: Partial<CustomerMetrics>,
  ): Customer {
    return {
      ...customer,
      metrics: {
        ...customer.metrics,
        ...metrics,
      },
      updatedAt: new Date(),
    };
  }
}

function defaultMetrics(): CustomerMetrics {
  return {
    lifetimeValue: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    noShowAppointments: 0,
    totalTreatments: 0,
    averageVisitValue: 0,
  };
}

function defaultPreferences(): CustomerPreferences {
  return {};
}

function defaultRecall(): CustomerRecall {
  return {
    recallIntervalMonths: 6,
    overdue: false,
  };
}

function defaultFlags(): CustomerFlags {
  return {
    vip: false,
    requiresManualApproval: false,
    collectionsHold: false,
    doNotSchedule: false,
  };
}