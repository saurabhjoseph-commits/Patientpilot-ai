# PatientPilot AI v2

# Deployment Guide

Version: 2.0

---

# Overview

This document defines the deployment architecture for PatientPilot AI.

The platform follows a three-environment deployment strategy to ensure reliable releases and safe production updates.

---

# Deployment Environments

## Development

Purpose

Local development.

URL

http://localhost:3000

Characteristics

Developer machine

Local testing

Fast iteration

Debugging enabled

---

## Staging

Purpose

Internal QA.

Characteristics

Production-like environment

QA testing

Demo environment

Pre-release validation

---

## Production

Purpose

Live customer environment.

Characteristics

High availability

Monitoring enabled

Secure configuration

Daily backups

Automatic deployment

---

# Technology Stack

Frontend

Next.js

Backend

Next.js Route Handlers

Database

Supabase PostgreSQL

Authentication

Supabase Auth

Voice

Twilio

Artificial Intelligence

OpenAI

Hosting

Vercel

Version Control

GitHub

Monitoring

Vercel Analytics

Future

Sentry

PostHog

UptimeRobot

---

# Repository

GitHub Repository

PatientPilot AI

Main Branch

main

Development Branch

develop

Feature Branches

feature/<feature-name>

Bug Fixes

fix/<bug-name>

Hotfix

hotfix/<issue>

---

# Git Workflow

Feature

↓

Pull Request

↓

Review

↓

Merge into develop

↓

QA

↓

Merge into main

↓

Production Deployment

---

# Deployment Process

Developer completes feature

↓

Run lint

↓

Run build

↓

Run QA

↓

Commit

↓

Push to GitHub

↓

Automatic Vercel Deployment

↓

Smoke Test

↓

Production Verification

---

# Required Build Checks

Every deployment must pass

npm run build

TypeScript

ESLint

Environment Validation

Database Connectivity

Authentication Test

API Test

---

# Environment Variables

Required

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

OPENAI_API_KEY

TWILIO_ACCOUNT_SID

TWILIO_AUTH_TOKEN

TWILIO_PHONE_NUMBER

Future

STRIPE_SECRET_KEY

STRIPE_WEBHOOK_SECRET

SMTP_HOST

SMTP_USERNAME

SMTP_PASSWORD

---

# Secrets Management

Never commit secrets to Git.

Use

Vercel Environment Variables

Supabase Secrets

GitHub Secrets

Rotate secrets periodically.

---

# Database Deployment

Schema changes use SQL migration files.

Location

database/migrations/

Example

001_initial_schema.sql

002_profiles.sql

003_clinic_settings.sql

004_rls.sql

Deploy order

Backup

↓

Run Migration

↓

Validate

↓

Deploy Application

---

# Release Strategy

Patch

Bug Fix

Example

2.0.1

Minor

New Feature

Example

2.1.0

Major

Architecture Change

Example

3.0.0

---

# Rollback Strategy

If deployment fails

Rollback Application

↓

Restore Database (if required)

↓

Investigate

↓

Fix

↓

Redeploy

---

# Monitoring

Monitor

Application Errors

Database Performance

Authentication Failures

Twilio Webhooks

OpenAI Errors

API Response Time

Build Failures

---

# Logging

Application Logs

API Logs

Authentication Logs

Webhook Logs

Audit Logs

AI Logs

---

# Backup Strategy

Supabase Daily Backup

Point-in-Time Recovery

Monthly Export

Quarterly Restore Test

---

# Production Checklist

Before every deployment

Database migration reviewed

Build successful

QA completed

Authentication verified

API verified

Environment variables verified

Twilio verified

OpenAI verified

Documentation updated

Version updated

Git tag created

---

# Disaster Recovery

If production becomes unavailable

Restore database

↓

Deploy previous release

↓

Verify authentication

↓

Verify APIs

↓

Verify Twilio

↓

Verify AI

↓

Resume service

---

# Future Infrastructure

Cloudflare CDN

Redis Cache

Background Workers

Queue Processing

AI Job Processing

Multi-region Deployment

Load Balancer

Kubernetes (Enterprise)

---

# Definition of Production Ready

Every release must

Compile successfully

Pass QA

Pass security review

Pass API validation

Pass authentication testing

Pass deployment checklist

Be fully documented

---

END

## J.3 telephony production gate

Before enabling Twilio callbacks, configure `TWILIO_AUTH_TOKEN` and `TWILIO_WEBHOOK_BASE_URL` with the exact HTTPS public origin configured in Twilio. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Apply the reviewable `0008_j3_webhook_deliveries.sql` migration before deploying the durable claim service. Deploy the signed webhook routes before pointing Twilio at them, then verify a valid callback, invalid-signature rejection, an unmapped destination rejection, and duplicate-delivery acknowledgement. Schedule `POST /api/internal/webhook-deliveries/cleanup` with `Authorization: Bearer ${WEBHOOK_CLEANUP_CRON_SECRET}` at least daily; it removes records after seven days.

## Password recovery configuration

Set `NEXT_PUBLIC_APP_URL` to an origin only: local development may use `http://localhost:3000`; staging and production must use HTTPS. Set Supabase Auth **Site URL** to the corresponding public application origin and add `http://localhost:3000/auth/callback`, `<staging-origin>/auth/callback`, and `https://patientpilot-ai.com/auth/callback` to Supabase Auth **Redirect URLs**.

In Supabase Auth **Email Templates → Reset Password**, use this exact link (do not replace it with `{{ .SiteURL }}` alone or a bare `/auth/v1/verify` URL):

```html
<!doctype html>
<html lang="en">
  <body>
    <p>We received a request to reset your PatientPilot password.</p>
    <p>
      <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&amp;type=recovery&amp;next=/reset-password">Reset your password</a>
    </p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
  </body>
</html>
```

Configure custom SMTP before production: a verified sender name/address, the recovery template above, and appropriate rate limits. Supabase's default email service is intended for limited development use and is not a production delivery guarantee. Never commit SMTP or Supabase credentials.

Password recovery requires each Supabase Auth user's email to match one Identity `users.email` record with a password credential. Validate that mapping in staging before enabling recovery. The completion route verifies the short-lived Supabase recovery access token server-side before updating the Identity password hash.
# Clinic scope prerequisites

Before applying the J.2 ownership and RLS migrations, set `PUBLIC_INTAKE_CLINIC_ID` to the UUID of the intentionally configured public-intake clinic. Do not use a name or slug as an ownership identifier. Configure `TELEPHONY_CLINIC_PHONE_MAP` as JSON mapping trusted destination phone numbers to clinic UUIDs before enabling telephony workflows.

Public requests never provide a trusted clinic identifier. Admin requests receive scope from the validated Identity context, while telephony workflows resolve scope only from server-side configuration. Apply the database migrations only after the application deployment and the clinic-scope tests have passed.
