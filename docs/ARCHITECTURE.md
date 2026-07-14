# PatientPilot AI Architecture

**Document:** ARCHITECTURE.md  
**Version:** 1.0.0  
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