# PatientPilot AI
# MASTER ROADMAP

## J.2.3 — Staging migration readiness

Clinic-aware application propagation, migration compatibility checks, and a staging runbook are complete. Production migration remains blocked pending staged execution, telemetry signature validation, and a separately approved patient-ownership milestone.
Version: 1.0
Status: In Development

---

# Vision

Build the world's leading AI Front Office Operating System for dental clinics.

PatientPilot AI is not simply an AI receptionist.

It is an AI employee capable of managing the entire front office while integrating seamlessly with human staff.

The platform must support clinics of every size while remaining a single global SaaS platform.

Countries:

- United States
- Australia
- India

Future expansion should require configuration—not new products.

---

# Mission

Help dental clinics:

• Never miss another patient call

• Increase booked appointments

• Reduce front desk workload

• Recover lost revenue

• Improve patient experience

• Automate repetitive administrative work

---

# Product Principles

## One Global Platform

Maintain one codebase.

Never create country-specific forks.

Use:

- Configuration
- Country adapters
- Localization
- Feature flags

instead.

---

## Multi-Tenant First

Every feature must support:

- multiple clinics
- multiple providers
- multiple locations
- multiple countries

---

## Configuration Over Customization

Every clinic should be onboarded through configuration.

Never require source-code changes for a clinic.

---

## Clean Architecture

Dependency Direction

Presentation

↓

Application

↓

Domain

↓

Infrastructure

Infrastructure depends on Domain.

Never the reverse.

---

## API First

Everything should be accessible through APIs.

Web UI is only one consumer.

Future clients:

- Mobile
- Voice AI
- WhatsApp
- SMS
- Third-party integrations

---

# Version 1.0 Goals

A clinic should be able to:

✓ Sign up

✓ Configure clinic

✓ Configure providers

✓ Configure services

✓ Configure schedules

✓ Connect phone

✓ AI answers calls

✓ AI books appointments

✓ AI reschedules

✓ AI cancels

✓ AI sends reminders

✓ AI recovers missed calls

✓ Staff dashboard

✓ CRM

✓ Analytics

✓ Billing

✓ Subscription management

---

# Development Roadmap

## EPIC A

Platform Foundation

Status

✅ Completed

Includes

- Clean Architecture

- Domain Layer

- Infrastructure Layer

- Dependency Injection

- Repository Pattern

---

## EPIC B

CRM Platform

Status

✅ Completed

Modules

- Leads

- Opportunities

- Activities

- Notes

- Pipelines

- Quotes

- Estimates

---

## EPIC C

AI Conversation

Status

✅ Completed

Modules

- Conversation Engine

- Intent Detection

- Memory

- AI Response

- Live Transcript

---

## EPIC D

Analytics

Status

✅ Completed

Modules

- Dashboard

- KPIs

- Charts

- Activity Feed

---

## EPIC E

Identity & Authentication

Status

🔄 In Progress

Deliverables

- UserCredential

- UserSession

- LoginAudit

- Authentication APIs

- JWT

- Authorization

- Sessions

- Middleware

---

## EPIC F

Scheduling Engine

Status

⬜ Planned

Modules

- Availability Engine

- Appointment Booking

- Rescheduling

- Cancellation

- Waitlist

- Chair Management

- Provider Calendars

- Holidays

---

## EPIC G

AI Front Office Manager

Status

⬜ Planned

Capabilities

- Answer Calls

- FAQs

- Insurance

- Appointment Booking

- Follow-ups

- Recall Campaigns

- Escalations

- Human Handoff

---

## EPIC H

CRM Automation

Status

⬜ Planned

Modules

- Workflow Engine

- Marketing Automation

- Patient Recall

- Revenue Recovery

- Treatment Follow-up

---

## EPIC I

Billing

Status

⬜ Planned

Modules

- Stripe

- Plans

- Subscription

- Usage

- Invoice

---

## EPIC J

Global Platform

Status

⬜ Planned

Modules

- Country Adapters

- Localization

- Timezones

- Currency

- Taxes

---

## EPIC K

Production

Status

⬜ Planned

Modules

- Monitoring

- Logging

- Security

- Performance

- Backup

- Disaster Recovery

---

## EPIC L

Launch

Status

⬜ Planned

Deliverables

- Demo Environment

- Website

- Documentation

- Sales Assets

- Customer Onboarding

---

# Definition of Done

A milestone is complete only if:

✓ Code reviewed

✓ Build passes

✓ Tests pass

✓ Documentation updated

✓ No TypeScript errors

✓ Production ready

---

# Engineering Rules

Never duplicate business logic.

Prefer composition over inheritance.

Keep files focused.

Keep modules loosely coupled.

Avoid circular dependencies.

Maintain backward compatibility.

Document every major decision.

---

# Success Metrics

Version 1.0 is complete when:

✓ First clinic onboarded

✓ First live AI phone call

✓ First appointment booked

✓ First recurring subscription

✓ First paying customer

---

# Long-Term Vision

PatientPilot AI evolves into a complete AI Front Office Operating System capable of serving thousands of clinics globally through one configurable platform.

---

END OF DOCUMENT
