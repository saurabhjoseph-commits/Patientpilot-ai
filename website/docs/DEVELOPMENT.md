# PatientPilot AI v2

# Development Standards

Version: 2.0

---

# Purpose

This document defines the engineering standards used throughout the PatientPilot AI platform.

Every contributor must follow these standards to ensure consistency, scalability, maintainability, and production quality.

---

# Engineering Principles

Build once.

Build correctly.

Build for scale.

Never duplicate logic.

Never sacrifice security for convenience.

Always prefer readability over cleverness.

Every feature must solve a real business problem.

---

# Technology Stack

Frontend

Next.js 16 (App Router)

React 19

TypeScript

Tailwind CSS

Backend

Next.js Route Handlers

Database

Supabase PostgreSQL

Authentication

Supabase Auth

AI

OpenAI

Voice

Twilio

Deployment

Vercel

Version Control

GitHub

---

# Folder Structure

app/

components/

lib/

database/

docs/

types/

public/

scripts/

Never create new top-level folders without updating ARCHITECTURE.md.

---

# Component Standards

Each component should:

Have one responsibility.

Be reusable.

Use TypeScript interfaces.

Avoid business logic.

Prefer composition over duplication.

---

# Service Layer

UI components must never communicate directly with Supabase.

Correct Flow

Component

↓

API Route

↓

Service

↓

Repository

↓

Supabase

↓

Database

Business logic belongs in Services.

Database access belongs in Repositories.

---

# Naming Conventions

Components

PascalCase

Example

PatientCard.tsx

Hooks

camelCase

Example

usePatients.ts

Types

PascalCase

Example

Patient.ts

Functions

camelCase

Example

createAppointment()

Constants

UPPER_SNAKE_CASE

Example

MAX_APPOINTMENTS

Environment Variables

UPPER_SNAKE_CASE

---

# TypeScript Standards

Strict Mode Enabled

Avoid any

Use Interfaces

Prefer explicit return types

Shared types belong in

types/

---

# API Standards

REST APIs

Use nouns

Example

/api/patients

Not

/api/getPatients

Always validate:

Authentication

Authorization

Request Body

Clinic Ownership

---

# Database Standards

UUID Primary Keys

Foreign Keys

Indexes

RLS Enabled

Audit Fields

Soft Delete Ready

Never duplicate patient information.

---

# Git Strategy

Main Branch

main

Development

develop

Feature

feature/<feature-name>

Bug Fix

fix/<bug-name>

Hotfix

hotfix/<issue>

---

# Commit Message Format

Examples

feat(auth): add login page

feat(ai): add appointment booking

fix(api): resolve Twilio webhook validation

docs(database): update schema

refactor(call-center): move business logic into services

---

# Pull Request Checklist

Build passes

TypeScript passes

No console errors

Documentation updated

QA completed

Feature tested

No secrets committed

---

# Testing Standards

Every feature requires:

Unit Testing (future)

Integration Testing

Manual QA

Production Smoke Test

Authentication Test

API Test

---

# Security Standards

Never expose secrets

Validate all inputs

Use HTTPS

Use secure cookies

Enable RLS

Log security events

Never trust client input

---

# Performance Standards

Lazy load large modules

Optimize images

Minimize bundle size

Avoid unnecessary re-renders

Use server components where appropriate

Cache data when appropriate

---

# Logging Standards

Log:

Authentication events

Errors

API failures

Webhook failures

AI requests

Billing events

Never log secrets.

Never log passwords.

---

# Documentation Standards

Every new feature must update:

DATABASE.md (if schema changes)

API.md (if API changes)

ARCHITECTURE.md (if structure changes)

ROADMAP.md (if milestone changes)

CHANGELOG.md (for every release)

---

# Definition of Done

A feature is complete only if:

Business requirements are met

Database is updated

API is implemented

UI is complete

Authentication is enforced

Authorization is enforced

Tests completed

Documentation updated

Build passes

QA passes

Ready for production

---

# AI-Assisted Development

ChatGPT is used as:

Architecture Advisor

Technical Architect

Code Generator

Code Reviewer

Product Strategist

Engineering Partner

All generated code must be:

Reviewed

Tested

Documented

Integrated carefully

---

# Engineering Philosophy

PatientPilot AI is built for long-term maintainability.

Every engineering decision should improve:

Reliability

Scalability

Security

Developer Experience

Customer Value

---

END