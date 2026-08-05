/**
 * ============================================================
 * PatientPilot AI
 * Customer Service
 * ============================================================
 */

import {
  Customer,
  CustomerLoyaltyTier,
  CustomerStatus,
} from "./customer.types";

import {
  validateCustomer,
  ValidationResult,
} from "./customer-validator";

import {
  CustomerPolicy,
  PolicyDecision,
} from "./customer-policy";

export class CustomerService {
  validate(
    customer: Customer,
  ): ValidationResult {
    return validateCustomer(customer);
  }

  canScheduleAppointment(
    customer: Customer,
  ): PolicyDecision {
    return CustomerPolicy.canScheduleAppointment(customer);
  }

  canReceiveRecall(
    customer: Customer,
  ): PolicyDecision {
    return CustomerPolicy.canReceiveRecall(customer);
  }

  isVIP(
    customer: Customer,
  ): boolean {
    return CustomerPolicy.isVIP(customer);
  }

  isHighRisk(
    customer: Customer,
  ): boolean {
    return CustomerPolicy.isHighRisk(customer);
  }

  activate(
    customer: Customer,
  ): Customer {
    return {
      ...customer,
      status: "active",
      updatedAt: new Date(),
    };
  }

  deactivate(
    customer: Customer,
  ): Customer {
    return {
      ...customer,
      status: "inactive",
      updatedAt: new Date(),
    };
  }

  archive(
    customer: Customer,
  ): Customer {
    return {
      ...customer,
      status: "archived",
      updatedAt: new Date(),
    };
  }

  updateStatus(
    customer: Customer,
    status: CustomerStatus,
  ): Customer {
    return {
      ...customer,
      status,
      updatedAt: new Date(),
    };
  }

  updateLoyaltyTier(
    customer: Customer,
    loyaltyTier: CustomerLoyaltyTier,
  ): Customer {
    return {
      ...customer,
      loyaltyTier,
      updatedAt: new Date(),
    };
  }

  recordCompletedAppointment(
    customer: Customer,
    visitValue: number,
  ): Customer {
    const metrics = customer.metrics;

    const completedAppointments =
      metrics.completedAppointments + 1;

    const totalAppointments =
      metrics.totalAppointments + 1;

    const lifetimeValue =
      metrics.lifetimeValue + visitValue;

    return {
      ...customer,
      metrics: {
        ...metrics,
        completedAppointments,
        totalAppointments,
        lifetimeValue,
        averageVisitValue:
          lifetimeValue / completedAppointments,
      },
      recall: {
        ...customer.recall,
        lastVisitAt: new Date(),
      },
      updatedAt: new Date(),
    };
  }

  recordCancelledAppointment(
    customer: Customer,
  ): Customer {
    return {
      ...customer,
      metrics: {
        ...customer.metrics,
        totalAppointments:
          customer.metrics.totalAppointments + 1,
        cancelledAppointments:
          customer.metrics.cancelledAppointments + 1,
      },
      updatedAt: new Date(),
    };
  }

  recordNoShow(
    customer: Customer,
  ): Customer {
    return {
      ...customer,
      metrics: {
        ...customer.metrics,
        totalAppointments:
          customer.metrics.totalAppointments + 1,
        noShowAppointments:
          customer.metrics.noShowAppointments + 1,
      },
      updatedAt: new Date(),
    };
  }

  updateRecallDate(
    customer: Customer,
    nextRecallAt: Date,
  ): Customer {
    return {
      ...customer,
      recall: {
        ...customer.recall,
        nextRecallAt,
        overdue: false,
      },
      updatedAt: new Date(),
    };
  }

  markRecallOverdue(
    customer: Customer,
  ): Customer {
    return {
      ...customer,
      recall: {
        ...customer.recall,
        overdue: true,
      },
      updatedAt: new Date(),
    };
  }
}

export const customerService =
  new CustomerService();