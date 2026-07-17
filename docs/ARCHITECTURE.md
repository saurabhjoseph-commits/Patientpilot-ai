# PatientPilot AI Architecture

**Document:** ARCHITECTURE.md  
**Version:** 1.1.0  
**Status:** Production  
**Owner:** Engineering  
**Last Updated:** July 2026

---

# Purpose

This document defines the software architecture for PatientPilot AI.

It establishes standards for:

- Folder structure
- Component architecture
- Routing
- API design
- Database integration
- Authentication
- State management
- Coding standards
- Deployment

Every new feature must follow this document.

---

# Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

---

## Backend

- Next.js Route Handlers
- Supabase
- PostgreSQL

---

## Authentication

Supabase Authentication

Protected routes

Server-side session validation

---

## AI

OpenAI

Twilio Voice

Future:

- RAG
- Knowledge Base
- Voice Personalization

---

## Deployment

Frontend

Vercel

Backend

Supabase

Domain

patientpilot-ai.com

Email

Google Workspace

---

# Project Structure

```
PatientPilot-AI/

docs/

website/

app/

components/

lib/

types/

public/

styles/

README.md
```

---

# Website Structure

```
website/

app/

components/

lib/

types/

hooks/

styles/

public/

middleware.ts
```

---

# App Router

```
/

login

book-demo

admin/

analytics

leads

patients

appointments

call-center

ai

demo

settings
```

Every feature receives its own route.

---

# Components

Reusable UI belongs here

```
components/ui/
```

Feature components

```
components/admin/

components/demo-center/

components/call-center/

components/auth/

components/demo/
```

Never duplicate reusable UI.

---

# Component Rules

Each component should have one responsibility.

Good

```
MetricCard

PageHeader

SectionCard
```

Bad

```
DashboardEverything.tsx
```

---

# Component Hierarchy

```
Page

↓

Layout

↓

Section

↓

Card

↓

Widget

↓

UI Component
```

Never skip layers.

---

# Server Components

Default

Use Server Components whenever possible.

Advantages

- Faster
- Less JavaScript
- Better SEO
- Better security

---

# Client Components

Only use

```
"use client"
```

when interaction is required.

Examples

- Forms
- Search
- Drag & Drop
- Charts
- Animation

---

# Folder Standards

App

```
app/

admin/

demo/

page.tsx

loading.tsx

error.tsx
```

Every route follows this structure.

---

# Library Structure

```
lib/

auth/

demo/

crm/

analytics/

ai/

twilio/

dashboard/
```

Business logic never belongs inside components.

---

# Service Pattern

Every module owns a service.

Example

```
demo-service.ts

lead-service.ts

appointment-service.ts

analytics-service.ts
```

UI never directly talks to Supabase.

---

# Types

All interfaces live inside

```
types/
```

Examples

```
Lead

Appointment

DemoProfile

Analytics

CallTranscript
```

Never define interfaces inside components unless local.

---

# Database Layer

Only

```
supabaseServer
```

inside Server Components.

Never expose Service Role keys to the browser.

---

# Tables

Current

```
contacts

appointments

call_messages
```

Upcoming

```
demo_profiles

demo_sessions

conversation_library
```

Every table must include

```
id

created_at

updated_at
```

---

# API Structure

```
app/api/

book-demo/

leads/

appointments/

twilio/

ai/

demo/
```

One resource per route.

---

# API Standards

Always return

```
success

data

message

error
```

Example

```json
{
  "success": true,
  "data": {},
  "message": "Lead created"
}
```

---

# Validation

Never trust client input.

Validate

- Required fields
- Email
- Phone
- IDs
- URLs

Prefer shared validation utilities.

---

# Error Handling

Never expose internal errors.

Good

```
Unable to create appointment.
```

Bad

```
Postgres error...
```

Log detailed errors server-side.

---

# Authentication

Every admin route

↓

Verify session

↓

Redirect if not authenticated

No exceptions.

---

# State Management

Prefer

React State

↓

Context

↓

Server State

Avoid global state unless necessary.

---

# Context Providers

Allowed

```
DemoProvider

AuthProvider

ThemeProvider
```

Avoid nested providers where possible.

---

# Styling

Tailwind CSS only.

No inline styles.

No CSS modules.

Global styles

```
globals.css
```

---

# Naming Conventions

Components

```
PascalCase
```

Hooks

```
useSomething
```

Services

```
something-service.ts
```

Utilities

```
something-utils.ts
```

Types

Singular

---

# Imports

Order

1.

React

2.

Next

3.

Third Party

4.

Internal Components

5.

Lib

6.

Types

---

# File Length

Recommended

Components

<250 lines

Services

<300 lines

Pages

<150 lines

Split when necessary.

---

# Performance

Server Components first.

Dynamic import large modules.

Memoize expensive calculations.

Optimize images.

Lazy load charts.

---

# Accessibility

Keyboard navigation.

ARIA labels.

Semantic HTML.

Visible focus.

Color contrast.

---

# Security

Environment variables

Never committed.

Service Role

Server only.

Sanitize user input.

Validate uploads.

Protect API routes.

---

# Logging

Development

Console logs allowed.

Production

Use structured logging.

Never log secrets.

---

# Testing Strategy

Unit

Utilities

Integration

Services

Manual QA

UI

Production QA

Vercel

---

# Deployment Pipeline

Development

↓

Git Commit

↓

GitHub

↓

Vercel Preview

↓

QA

↓

Production

---

# Git Branches

main

Production

develop

Active work

feature/demo-center

Feature branches

---

# Pull Request Checklist

✓ Builds successfully

✓ TypeScript passes

✓ Responsive

✓ Accessible

✓ No duplicated code

✓ Matches Design System

✓ QA complete

---

# Documentation Rule

Every new feature updates:

DESIGN_SYSTEM.md (if UI changes)

ARCHITECTURE.md (if architecture changes)

PRODUCT_ROADMAP.md (progress)

CHANGELOG.md (release notes)

---

# Product Philosophy

Architecture should support growth.

Every feature must be:

- Modular
- Typed
- Reusable
- Testable
- Secure
- Performant

---

# Golden Rule

We are building a scalable SaaS platform.

Every engineering decision should make PatientPilot AI easier to maintain, extend, and operate as the product grows.

---

# Application Architecture

While the previous sections define the platform architecture, this section defines how business modules are engineered within PatientPilot AI.

## Layered Architecture

```
Browser
    │
    ▼
Next.js Page
    │
    ▼
API Route
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Supabase
```

Every production feature should follow this layered architecture.

---

## Layer Responsibilities

### UI

Responsible for:

- Rendering
- User interaction
- Displaying application state

UI components must never contain business logic.

---

### API Routes

Responsible for:

- Parsing HTTP requests
- Authentication
- Authorization
- Calling application services
- Returning standardized HTTP responses

API routes must never communicate directly with the database.

---

### Services

Services contain business logic.

Responsibilities include:

- Validation
- Business rules
- Workflow orchestration
- Cross-module coordination
- Future integrations (email, AI, notifications)

Services must never return HTTP responses.

---

### Repositories

Repositories are responsible only for persistence.

Responsibilities include:

- CRUD operations
- Queries
- Transactions
- Database communication

Repositories must never contain business rules.

---

### Mappers

Mappers translate between:

- Database rows
- Domain models
- DTOs

Business logic should never exist inside mappers.

---

## Business Module Standard

Every new business module should follow this structure whenever applicable.

```
lib/<module>/

types.ts
constants.ts
validation.ts
mapper.ts
repository.ts
supabase-repository.ts
service.ts
index.ts
```

Examples:

```
lib/leads/
lib/appointments/
lib/patients/
lib/clinic/
```

---

## Dependency Rules

Allowed

```
Route
 ↓
Service
 ↓
Repository
```

Not Allowed

```
Route
 ↓
Supabase
```

Not Allowed

```
Service
 ↓
NextResponse
```

Not Allowed

```
Repository
 ↓
Business Logic
```

---

# Migration Standards

PatientPilot AI is migrating incrementally to the layered architecture.

Every migration should follow the same sequence.

## Migration Workflow

1. Define types
2. Create constants
3. Create validation
4. Create mapper
5. Create repository
6. Create service
7. Migrate API route
8. Build successfully
9. Perform QA
10. Commit changes

No large "big bang" refactors should be performed.

Production stability always has priority.

---

## Build Policy

Every milestone must:

- Compile successfully
- Pass TypeScript
- Preserve existing functionality
- Avoid unnecessary breaking changes

Build after every completed milestone.

---

## Code Review Checklist

Before merging:

- No duplicated business logic
- No direct Supabase access inside API routes
- Validation handled by services
- Repository contains persistence only
- Mapper handles translations only
- API responses remain consistent
- Files remain modular and focused

---

# Multi-Tenant Principles

PatientPilot AI is designed as a multi-tenant SaaS platform.

Every engineering decision should support future onboarding of multiple clinics without requiring custom code.

## Tenant Isolation

Business entities should be designed to support:

```
clinic_id
```

Repositories should never assume a single clinic deployment.

---

## Domain Independence

Domain models should remain independent of Supabase implementation details.

Business logic should work regardless of the persistence provider.

---

## Configurability

Platform behavior should be configurable through data and administration rather than code changes whenever practical.

---

## Scalability

Features should be designed to support:

- Multiple clinics
- Multiple countries
- Localization
- Country-specific integrations
- Future feature flags

without requiring architectural redesign.

---

## Engineering Goal

Every new feature should move PatientPilot AI closer to becoming a scalable AI Front Office Operating System while maintaining a clean, modular, and maintainable codebase.