# PatientPilot AI Deployment Guide

**Document:** DEPLOYMENT.md  
**Version:** 1.0.0  
**Status:** Production  
**Owner:** DevOps / Engineering  
**Last Updated:** July 2026

---

# Purpose

This document defines the official deployment process for PatientPilot AI.

It includes:

- Local development
- Git workflow
- GitHub
- Vercel deployment
- Supabase configuration
- Domain configuration
- Google Workspace
- Environment variables
- Monitoring
- Rollback procedures
- Disaster recovery

This document is the source of truth for production deployments.

---

# Production Architecture

```
                        Users
                          │
                          ▼
                 patientpilot-ai.com
                          │
                          ▼
                      Cloudflare (Future)
                          │
                          ▼
                       Vercel
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
   Next.js App                      API Routes
        │                                   │
        └─────────────────┬─────────────────┘
                          ▼
                     Supabase
                          │
         ┌────────────────┼─────────────────┐
         ▼                ▼                 ▼
     PostgreSQL      Authentication     Storage
                          │
                          ▼
                      OpenAI API
                          │
                          ▼
                        Twilio
```

---

# Production Services

## Frontend

Platform

Vercel

---

## Backend

Next.js Route Handlers

Hosted on Vercel

---

## Database

Supabase PostgreSQL

---

## Authentication

Supabase Auth

---

## Domain

patientpilot-ai.com

---

## Email

Google Workspace

---

## AI

OpenAI

---

## Telephony

Twilio

---

# Repository

Primary Repository

```
PatientPilot-AI
```

Main Branch

```
main
```

Development

```
develop
```

Feature Branches

```
feature/demo-center

feature/crm

feature/analytics
```

---

# Local Development

Requirements

- Node.js LTS
- npm
- Git
- VS Code
- Supabase Project
- Vercel Account

---

Clone Repository

```bash
git clone <repository-url>

cd PatientPilot-AI
```

---

Install Dependencies

```bash
cd website

npm install
```

---

Run Development Server

```bash
npm run dev
```

Application

```
http://localhost:3000
```

---

# Environment Variables

Location

```
website/.env.local
```

---

Required Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

TWILIO_ACCOUNT_SID=

TWILIO_AUTH_TOKEN=

TWILIO_PHONE_NUMBER=

NEXT_PUBLIC_ENABLE_AI_RECEPTIONIST=true
```

Never commit `.env.local`.

---

# Build Verification

Before every deployment

```bash
npm run build
```

Must complete successfully.

---

Type Check

```bash
npx tsc --noEmit
```

---

Lint

```bash
npm run lint
```

No warnings before production.

---

# Git Workflow

Create Feature Branch

```bash
git checkout -b feature/demo-center
```

---

Commit

```bash
git add .

git commit -m "feat: add Demo Center foundation"
```

---

Push

```bash
git push origin feature/demo-center
```

---

Merge

```
feature

↓

develop

↓

main
```

Production deploys only from `main`.

---

# Vercel Deployment

Connect GitHub Repository.

Framework

Next.js

Root Directory

```
website
```

Build Command

```
npm run build
```

Output

Automatic

---

Environment Variables

Configure all variables inside:

Vercel

↓

Project Settings

↓

Environment Variables

Never hardcode secrets.

---

# Domain Configuration

Primary

```
patientpilot-ai.com
```

Redirect

```
www.patientpilot-ai.com

↓

patientpilot-ai.com
```

SSL

Enabled

---

# Google Workspace

Primary User

```
saurabh.joseph@patientpilot-ai.com
```

Business Emails

```
info@

support@

sales@

demo@

billing@

careers@

admin@
```

---

# Supabase

Enable

- Row Level Security
- Daily backups
- Authentication
- Email verification

Never expose Service Role Key.

---

# Twilio

Production Number

Store only in environment variables.

Webhook

```
/api/twilio/voice
```

Status Callback

```
/api/twilio/status
```

---

# OpenAI

Model

Defined in application configuration.

Never expose API keys.

Monitor usage monthly.

---

# Deployment Checklist

Before deployment

- All tests pass
- TypeScript passes
- Build succeeds
- Environment variables verified
- Database migrations applied
- Documentation updated

---

# Post Deployment QA

Verify:

- Home page
- Contact form
- Login
- Admin dashboard
- CRM
- Demo Center
- AI Receptionist
- Analytics
- API endpoints
- Twilio integration

---

# Monitoring

Monitor

- Vercel deployment logs
- Function errors
- Build failures
- API errors
- Supabase logs
- Twilio logs
- OpenAI usage

---

# Rollback

If production fails

1. Open Vercel
2. Select previous successful deployment
3. Promote previous deployment
4. Verify application
5. Investigate failure

Never deploy untested fixes directly to production.

---

# Backup Strategy

Daily

Supabase Backup

Weekly

Export database schema

Monthly

Export critical business data

Before every major release

- Database backup
- Environment variable audit
- Deployment verification

---

# Security Checklist

- HTTPS enabled
- Secrets stored securely
- RLS enabled
- Authentication verified
- API validation enabled
- No exposed keys
- CSP headers (future)

---

# Disaster Recovery

If production becomes unavailable

1. Verify Vercel status
2. Verify Supabase status
3. Verify DNS
4. Restore previous deployment
5. Restore database if required
6. Notify affected customers (future)

---

# Release Workflow

```
Development

↓

Local Testing

↓

GitHub

↓

Vercel Preview

↓

QA

↓

Merge to main

↓

Production Deployment

↓

Smoke Testing

↓

Release Notes

↓

Monitoring
```

---

# Definition of Successful Deployment

A deployment is complete only when:

- Website loads
- APIs respond correctly
- Authentication works
- Database accessible
- AI Receptionist operational
- Twilio connected
- Google Workspace operational
- Demo Center functional
- No console errors
- QA passed

---

# Future Improvements

- GitHub Actions CI/CD
- Automated testing
- Preview deployment automation
- Sentry error monitoring
- Uptime monitoring
- Cloudflare CDN
- WAF protection
- Performance dashboards

---

# Golden Rule

Never deploy directly to production without:

- Successful local build
- Successful preview deployment
- QA approval
- Updated documentation

Production stability is always more important than release speed.

---

# Version History

## v1.0.0

- Initial deployment guide
- Local development workflow
- Git workflow
- Vercel deployment
- Supabase configuration
- Google Workspace
- Twilio
- Security checklist
- Disaster recovery
- Release workflow