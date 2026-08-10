# PatientPilot AI
# DOMAIN_MODEL

**Document:** DOMAIN_MODEL.md  
**Version:** 1.0.0  
**Status:** Production  
**Owner:** Engineering & Product  
**Last Updated:** July 2026

---

# Purpose

This document defines the core business domain of PatientPilot AI.

It is the authoritative reference for:

- Business entities
- Value objects
- Aggregates
- Domain relationships
- Domain events
- Business invariants
- Ownership boundaries

The Domain Model represents business concepts only.

It must remain independent of:

- Supabase
- Next.js
- React
- APIs
- External vendors

---

# Product Domain

PatientPilot AI is an AI Front Office Operating System for dental clinics.

The platform manages:

- Clinics
- Staff
- Patients
- Scheduling
- AI Conversations
- CRM
- Billing
- Analytics
- Notifications

---

# Domain Principles

## Business First

The domain models the business—not the database.

Never introduce entities simply because a table exists.

---

## Framework Independent

Domain objects must not depend on:

- Supabase
- React
- Next.js
- Twilio
- OpenAI
- Stripe

---

## Rich Domain Model

Business rules belong inside the domain.

Avoid anemic models where entities only hold data.

---

## Multi-Tenant

Every business entity belongs to exactly one tenant unless explicitly global.

```
Tenant
    │
    └── Clinic
            ├── Users
            ├── Patients
            ├── Providers
            ├── Appointments
            └── Conversations
```

---

# Core Aggregates

The platform is organized into the following aggregate roots.

## Tenant

Represents a customer organization.

Responsibilities:

- Subscription
- Plan
- Feature Flags
- Country
- Branding
- Configuration

Owns:

- Clinics

---

## Clinic

Represents a dental practice.

Owns:

- Providers
- Staff
- Patients
- Services
- Appointments
- AI Configuration
- Business Hours

Clinic is the primary business aggregate.

---

## Patient

Represents a person receiving care.

Owns:

- Contact Information
- Appointments
- Treatments
- Notes
- Communication History

---

## Appointment

Represents a scheduled patient visit.

Owns:

- Patient
- Provider
- Service
- Time Slot
- Status

Rules:

- Cannot overlap provider availability.
- Must belong to one clinic.
- Status transitions must be valid.

---

## Conversation

Represents an AI interaction.

Types:

- Phone
- SMS
- Web Chat
- WhatsApp (future)

Owns:

- Transcript
- Intent
- Outcome
- Escalation
- Actions Performed

---

## Lead

Represents a prospective patient.

Owns:

- Contact Details
- Source
- Pipeline Stage
- Activities
- Notes

---

## Opportunity

Represents potential revenue.

Owns:

- Lead
- Estimated Value
- Probability
- Quotes
- Estimates

---

## Subscription

Represents the commercial relationship.

Owns:

- Plan
- Billing Status
- Usage
- Renewal
- Limits

---

# Supporting Entities

These entities exist within aggregate boundaries.

- User
- UserCredential
- UserSession
- Provider
- StaffMember
- Service
- Treatment
- Quote
- Estimate
- Invoice
- Payment
- Notification
- Workflow
- AuditLog
- Activity
- Call
- Transcript
- InsurancePlan

Supporting entities are never aggregate roots unless promoted by future business needs.

---

# Value Objects

Value objects are immutable.

## PersonName

Fields:

- First Name
- Last Name
- Display Name

---

## EmailAddress

Validated email.

---

## PhoneNumber

Stores normalized phone number.

Country-aware.

---

## Address

- Street
- City
- State
- Postal Code
- Country

---

## Money

Fields:

- Amount
- Currency

Supports multi-country billing.

---

## TimeRange

Fields:

- Start
- End

Used by scheduling.

---

## BusinessHours

Defines weekly availability.

---

# Entity Relationships

```
Tenant
   │
   ▼
Clinic
   ├──────────────┐
   ▼              ▼
Patient      Provider
   │              │
   └──────┐       │
          ▼       ▼
      Appointment
          │
          ▼
     Conversation
```

---

# Domain Events

Business actions publish immutable events.

Examples:

- ClinicCreated
- UserInvited
- PatientCreated
- AppointmentBooked
- AppointmentRescheduled
- AppointmentCancelled
- ConversationStarted
- ConversationCompleted
- LeadCreated
- LeadConverted
- PaymentReceived
- SubscriptionActivated

Events enable automation while reducing coupling.

---

# Business Rules

## Appointment

- A patient cannot have overlapping appointments.
- A provider cannot be double-booked.
- Emergency appointments may bypass normal scheduling rules when authorized.

---

## Patient

- Email addresses must be unique within a clinic.
- Communication history must be retained for audit purposes.

---

## Conversation

- Every conversation belongs to one clinic.
- AI actions must be traceable.
- Human handoff must preserve conversation context.

---

## Billing

- One active subscription per tenant.
- Plan limits control feature access.
- Usage contributes to billing metrics.

---

# Identity Model

Authentication is separate from business identity.

```
User
    │
    ├── UserCredential
    ├── UserSession
    └── RoleAssignment
```

Passwords never exist inside the `User` entity.

---

# Scheduling Domain

The scheduling engine combines:

- Provider Availability
- Clinic Business Hours
- Chair Availability
- Holidays
- Time Off
- Appointment Rules

Scheduling decisions are deterministic and rule-driven.

---

# AI Domain

The AI subsystem coordinates business workflows.

```
Conversation
      │
      ▼
Intent
      │
      ▼
Workflow
      │
      ▼
Action
      │
      ▼
Business Use Case
```

The AI never modifies data directly.

It invokes application use cases.

---

# CRM Domain

Pipeline flow:

```
Lead
    │
    ▼
Opportunity
    │
    ▼
Quote
    │
    ▼
Appointment
    │
    ▼
Patient
```

Each transition should be auditable.

---

# Domain Boundaries

| Domain | Owns |
|----------|------|
| Clinic | Configuration, Providers, Services |
| Patient | Patient Records |
| Scheduling | Appointments |
| CRM | Leads, Opportunities |
| AI | Conversations, Intents |
| Billing | Subscription, Payments |
| Analytics | Metrics, KPIs |
| Identity | Users, Credentials |

---

# Domain Invariants

The following rules must always hold:

- Every clinic belongs to one tenant.
- Every patient belongs to one clinic.
- Every appointment references one patient and one provider.
- Every AI conversation belongs to one clinic.
- Credentials are never stored in the User entity.
- Domain entities remain persistence-agnostic.

Violating these invariants is considered a defect.

---

# Future Expansion

The domain model is designed to support:

- Multi-location clinics
- Dental service catalogs
- Country adapters
- Additional communication channels
- AI workflow expansion
- Third-party practice management integrations

These capabilities should extend existing aggregates rather than introduce parallel models.

---

# Engineering Goal

The domain model should evolve carefully over time while preserving business consistency.

Every new feature should either:

- Extend an existing aggregate,
- Introduce a well-justified new aggregate, or
- Add a supporting entity or value object.

The integrity of the domain is more important than implementation convenience.

---

END