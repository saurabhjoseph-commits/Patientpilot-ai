# PatientPilot AI
# DATABASE_SCHEMA

## J.2 ownership staging status

The prepared staging package makes `clinic_id` required for contacts, appointments, calls, call messages, and clinic settings after verified backfill. `lead_activity` remains scoped through `contacts.lead_id`; no `clinic_id` is added to that table. Patients are explicitly deferred because the authoritative production schema does not establish UUID clinic ownership.

**Document:** DATABASE_SCHEMA.md
**Version:** 1.0.0
**Status:** Living Document
**Owner:** Engineering
**Last Updated:** July 2026

---

# Purpose

This document defines the database architecture of PatientPilot AI.

It serves as the authoritative reference for:

- Database tables
- Relationships
- Constraints
- Indexes
- Tenant isolation
- Audit fields
- Naming conventions
- Migration strategy

The database schema must support a global multi-tenant SaaS platform while remaining scalable, secure, and maintainable.

---

# Database Platform

Current Database

- PostgreSQL
- Supabase

Future Support

- Managed PostgreSQL
- Azure Database for PostgreSQL
- Amazon RDS PostgreSQL

The application should remain portable across PostgreSQL-compatible providers.

---

# Database Principles

## Multi-Tenant First

Every business record belongs to a tenant unless explicitly global.

```
Tenant
    │
    ▼
Clinic
    │
    ▼
Business Data
```

---

## UUID Primary Keys

Every table uses UUID primary keys.

Example

```
id UUID PRIMARY KEY
```

---

## Audit Fields

Every business table includes:

```
id

created_at

updated_at

created_by

updated_by
```

Where applicable:

```
deleted_at

deleted_by
```

---

## Soft Deletes

Business records should be soft deleted unless regulations require permanent deletion.

```
deleted_at
```

A non-null value indicates the record has been deleted.

---

# Naming Standards

Tables

Plural snake_case

Examples

```
patients

appointments

providers

clinics
```

Columns

snake_case

Examples

```
first_name

appointment_date

clinic_id
```

Indexes

```
idx_table_column
```

Foreign Keys

```
fk_table_reference
```

---

# Tenant Structure

```
tenants

↓

clinics

↓

providers

patients

appointments

conversations

users

services
```

Every business table references:

```
tenant_id

clinic_id
```

where appropriate.

---

# Core Tables

## tenants

Purpose

Represents a customer organization.

Fields

```
id

name

status

subscription_plan

country_code

timezone

created_at

updated_at
```

---

## clinics

Purpose

Represents an individual dental practice.

Fields

```
id

tenant_id

name

phone

email

website

timezone

currency

status

created_at

updated_at
```

---

## users

Purpose

Application users.

Fields

```
id

tenant_id

clinic_id

email

first_name

last_name

status

created_at

updated_at
```

Passwords are stored separately.

---

## user_credentials

Purpose

Authentication data.

Fields

```
id

user_id

password_hash

password_changed_at

failed_attempts

locked_until

last_login_at

created_at

updated_at
```

---

## user_sessions

Purpose

Refresh token and session management.

Fields

```
id

user_id

refresh_token_hash

expires_at

last_activity_at

ip_address

user_agent

created_at
```

---

## roles

Purpose

Application roles.

Examples

```
Owner

Administrator

Dentist

Receptionist

Manager
```

---

## permissions

Fine-grained permissions.

---

## role_permissions

Many-to-many mapping.

---

## user_roles

Many-to-many mapping.

---

# Clinical Domain

## providers

Dentists and hygienists.

---

## operatories

Treatment rooms.

---

## services

Dental services.

Examples

```
Cleaning

Whitening

Extraction

Implant

Consultation
```

---

## patients

Patient master records.

Fields

```
id

clinic_id

first_name

last_name

date_of_birth

email

phone

status

created_at

updated_at
```

---

## appointments

Purpose

Scheduling.

Fields

```
id

patient_id

provider_id

operatory_id

service_id

start_time

end_time

status

notes

created_at

updated_at
```

---

## appointment_status_history

Tracks appointment lifecycle.

---

# CRM

## leads

Prospective patients.

---

## lead_tags

Lead tagging.

---

## opportunities

Sales opportunities.

---

## pipelines

CRM pipelines.

---

## pipeline_stages

Pipeline stages.

---

## activities

CRM activities.

---

## notes

Notes attached to records.

---

## tags

Reusable tags.

---

# AI

## conversations

AI conversations.

---

## call_sessions

Phone calls.

---

## transcripts

Conversation transcripts.

---

## ai_messages

Generated responses.

---

## ai_memory

Conversation memory.

---

## ai_workflows

Workflow execution history.

---

# Billing

## subscriptions

Tenant subscription.

---

## invoices

Invoices.

---

## payments

Payments.

---

## usage_records

Usage metering.

---

# Notifications

## notifications

Outgoing notifications.

---

## notification_templates

Reusable templates.

---

## notification_logs

Delivery history.

---

# Analytics

## analytics_events

Application events.

---

## dashboard_snapshots

Precomputed metrics.

---

## audit_logs

Security auditing.

---

# Relationships

```
Tenant

└── Clinics

      ├── Users

      ├── Providers

      ├── Patients

      │      │

      │      └── Appointments

      │

      ├── Conversations

      │      └── Transcripts

      │

      ├── Leads

      │      └── Opportunities

      │

      └── Services
```

---

# Foreign Key Rules

Every FK must:

- Use UUID
- Enforce referential integrity
- Be indexed
- Prevent orphan records

---

# Index Strategy

Examples

```
idx_patients_email

idx_appointments_provider

idx_appointments_start_time

idx_conversations_created_at

idx_leads_status

idx_users_email
```

Composite indexes should support common queries.

---

# Transactions

Required for:

- Appointment booking
- Authentication
- Billing
- Subscription updates
- Lead conversion

---

# Migration Strategy

Use versioned migrations.

Rules

- Never edit historical migrations.
- Create incremental migrations only.
- Test before deployment.
- Support rollback where practical.

---

# Data Retention

Suggested defaults:

| Data | Retention |
|-------|-----------|
| Audit Logs | 7 years |
| AI Conversations | Configurable |
| Call Recordings | Configurable |
| Appointments | Permanent |
| Billing Records | Per legal requirements |
| Analytics Events | Configurable |

---

# Security

- Row Level Security (RLS)
- Tenant isolation
- Encryption at rest
- TLS in transit
- Least privilege
- Database backups
- Secret management

---

# Future Schema

Planned additions include:

- Recall campaigns
- Treatment plans
- Insurance claims
- Online forms
- Document management
- Multi-location scheduling
- Referral management
- Patient portal
- AI knowledge base
- Workflow automation

These additions should extend the existing schema rather than replace it.

---

# Engineering Goal

The database schema should support:

- Thousands of clinics
- Millions of patients
- High-volume AI conversations
- Multi-country deployments
- Future integrations
- Zero-downtime migrations

The schema must remain normalized where practical, optimized for common access patterns, and evolve through incremental, well-documented migrations.

---

END
