# PatientPilot AI Database Design

**Document:** DATABASE.md  
**Version:** 1.0.0  
**Status:** Production  
**Owner:** Engineering  
**Last Updated:** July 2026

---

# Purpose

This document defines the official database architecture for PatientPilot AI.

It includes:

- Database schema
- Table definitions
- Relationships
- Naming conventions
- Indexes
- Security (RLS)
- Future expansion

Supabase PostgreSQL is the single source of truth.

---

# Database Overview

```
PatientPilot AI

        │
        ▼

   PostgreSQL (Supabase)

        │
        ├──────── Contacts
        ├──────── Patients
        ├──────── Appointments
        ├──────── Call Messages
        ├──────── Demo Profiles
        ├──────── Demo Sessions
        ├──────── Conversation Library
        ├──────── AI Knowledge
        ├──────── Users
        └──────── Audit Logs
```

---

# Database Naming Rules

## Tables

Plural

Examples

contacts

appointments

patients

demo_profiles

---

## Columns

snake_case

Examples

created_at

updated_at

practice_name

phone_number

---

## Primary Key

Every table

```
id UUID PRIMARY KEY
```

---

## Timestamps

Every table contains

```
created_at

updated_at
```

---

# Existing Tables

---

# contacts

Stores inbound leads.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| clinic_name | text |
| dentist_name | text |
| email | text |
| phone | text |
| monthly_calls | integer |
| message | text |
| status | text |
| created_at | timestamptz |
| updated_at | timestamptz |

---

Purpose

CRM

Website Contact Form

Sales Pipeline

---

# patients

Stores confirmed patients.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| first_name | text |
| last_name | text |
| email | text |
| phone | text |
| date_of_birth | date |
| notes | text |
| created_at | timestamptz |
| updated_at | timestamptz |

---

# appointments

Stores appointments.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| patient_id | uuid |
| appointment_date | timestamptz |
| appointment_type | text |
| status | text |
| notes | text |
| created_at | timestamptz |
| updated_at | timestamptz |

---

Relationship

```
Patient

1

↓

Many

Appointments
```

---

# call_messages

Stores AI conversation transcripts.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| patient_name | text |
| phone | text |
| transcript | text |
| summary | text |
| intent | text |
| duration | integer |
| created_at | timestamptz |

---

Purpose

Live Monitor

Analytics

CRM Timeline

AI Review

---

# Upcoming Tables

---

# demo_profiles

Stores personalized clinic demos.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| practice_name | text |
| dentist_name | text |
| city | text |
| website | text |
| logo_url | text |
| practice_type | text |
| services | jsonb |
| insurance | jsonb |
| office_hours | jsonb |
| status | text |
| created_at | timestamptz |
| updated_at | timestamptz |

---

# demo_sessions

Stores presentation history.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| profile_id | uuid |
| started_at | timestamptz |
| ended_at | timestamptz |
| duration | integer |
| outcome | text |
| notes | text |
| created_at | timestamptz |

---

Relationship

```
Demo Profile

1

↓

Many

Demo Sessions
```

---

# conversation_library

Stores demo conversations.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| title | text |
| category | text |
| duration | integer |
| scenario | jsonb |
| active | boolean |
| created_at | timestamptz |

---

# ai_knowledge

Knowledge base for AI.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| practice_id | uuid |
| title | text |
| content | text |
| category | text |
| embedding_status | text |
| created_at | timestamptz |

---

# users

Application users.

Managed by Supabase Auth.

Extra profile data.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| full_name | text |
| role | text |
| avatar_url | text |
| created_at | timestamptz |

---

# audit_logs

Stores system activity.

Columns

| Column | Type |
|----------|------|
| id | uuid |
| user_id | uuid |
| action | text |
| entity | text |
| entity_id | uuid |
| metadata | jsonb |
| created_at | timestamptz |

---

# Relationships

```
Users
 │
 ├──────── Contacts
 │
 ├──────── Patients
 │         │
 │         └──── Appointments
 │
 ├──────── Demo Profiles
 │         │
 │         └──── Demo Sessions
 │
 └──────── AI Knowledge
```

---

# JSON Columns

Allowed

services

insurance

office_hours

metadata

scenario

Never store large binary data.

---

# Indexes

Required

email

phone

created_at

status

patient_id

profile_id

---

Example

```
CREATE INDEX idx_contacts_email
ON contacts(email);
```

---

# Foreign Keys

Example

```
appointments.patient_id

↓

patients.id
```

Always use foreign keys.

---

# Row Level Security

Every production table

RLS Enabled

Policies

Authenticated users only

Public tables only when required.

---

# Soft Deletes

Future

```
deleted_at
```

Never permanently remove business-critical records.

---

# Audit Trail

Every important action should create a log.

Examples

Appointment booked

Lead updated

Demo started

Presentation finished

AI knowledge changed

---

# Migration Rules

Every schema change

↓

Migration file

↓

Reviewed

↓

Tested

↓

Production

Never edit production manually.

---

# Backup Strategy

Supabase backups enabled.

Before every major release

Export schema

Export data

Verify restore process

---

# Performance

Use indexes.

Avoid SELECT * in production.

Paginate tables.

Use server-side filtering.

---

# Security

Never expose Service Role Key.

Validate every input.

Use parameterized queries.

Enable RLS.

Store secrets only in environment variables.

---

# Future Database Expansion

Version 2

- Outreach Campaigns
- Email Tracking
- SMS Tracking
- Proposal Management

Version 3

- Billing
- Subscriptions
- Organizations
- Team Members
- Multi-Tenant Support

---

# Database Standards

Every table must include

- UUID primary key
- created_at
- updated_at
- RLS enabled
- Proper indexes
- Foreign keys where applicable

---

# Golden Rule

The database is the foundation of PatientPilot AI.

Design every table for scalability, security, and long-term maintainability rather than short-term convenience.

---

# Version History

## v1.0.0

- Initial database architecture
- Existing tables documented
- Demo Center schema
- AI knowledge schema
- Relationship standards
- Security standards