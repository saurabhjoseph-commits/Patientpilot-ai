# PatientPilot AI v2

# Security Architecture

Version: 2.0

---

# Overview

PatientPilot AI is designed as a secure multi-tenant SaaS platform.

Security is implemented in multiple layers including:

• Authentication

• Authorization

• Tenant Isolation

• Database Security

• API Security

• Infrastructure Security

• Audit Logging

---

# Security Principles

Least Privilege

Every user only receives the minimum permissions required.

Defense in Depth

Multiple security layers protect every request.

Zero Trust

Every request is authenticated and authorized.

Secure by Default

New features must be secure before release.

---

# Authentication

Provider

Supabase Authentication

Supported Methods

Email + Password

Password Reset

Email Verification

Future

Google OAuth

Microsoft OAuth

Apple Sign In

Magic Link

---

# Authorization

User Roles

Super Admin

Owner

Manager

Receptionist

Dentist

Every request validates:

Authenticated User

↓

Role

↓

Clinic Membership

↓

Permission

↓

Requested Resource

---

# Multi-Tenant Security

Every business table includes:

clinic_id

Every query is filtered by:

clinic_id

No clinic can access another clinic's records.

---

# Row Level Security (RLS)

RLS is enabled for all tenant data.

Policies ensure:

Users can read only their clinic's data.

Users can modify only permitted records.

Super Admin bypasses tenant restrictions using the service role.

---

# Session Management

Secure session cookies

Automatic session refresh

Logout from all devices (future)

Session timeout after inactivity

---

# Secrets Management

Never expose:

SUPABASE_SERVICE_ROLE_KEY

OPENAI_API_KEY

TWILIO_AUTH_TOKEN

STRIPE_SECRET_KEY

Secrets are stored only in environment variables.

Never commit secrets to Git.

---

# API Security

HTTPS Only

JWT Validation

Authentication Required

Authorization Required

Input Validation

Output Sanitization

Rate Limiting

Audit Logging

---

# Input Validation

Validate:

Email

Phone Number

UUID

Dates

Appointment Times

Clinic IDs

Reject malformed requests.

---

# SQL Injection Protection

Use parameterized queries.

Never concatenate SQL strings.

All database access goes through Supabase client libraries.

---

# XSS Protection

Escape rendered content.

Sanitize user-generated text.

Avoid dangerouslySetInnerHTML unless absolutely necessary.

---

# CSRF Protection

Use secure cookies.

Validate authenticated requests.

Protect sensitive actions.

---

# File Upload Security

Allowed Types

PDF

PNG

JPEG

Maximum File Size

10 MB

Virus scanning (future)

Store uploads in Supabase Storage.

---

# Audit Logging

Record:

Login

Logout

Password Reset

Profile Changes

Clinic Updates

Appointment Changes

Billing Events

Permission Changes

Audit log fields:

User

Clinic

Action

Timestamp

IP Address

User Agent

---

# Backup Strategy

Automatic daily backups

Point-in-time recovery

Monthly export

Disaster recovery testing

---

# Monitoring

Monitor:

Authentication failures

API errors

Webhook failures

AI errors

Twilio failures

Database performance

---

# Compliance

PatientPilot AI is not intended to store full electronic medical records.

If future requirements include protected health information (PHI), the platform must undergo a HIPAA readiness assessment and appropriate agreements (such as Business Associate Agreements where applicable) before marketing itself as HIPAA-compliant.

---

# Secure Development Standards

Every feature must include:

Authentication

Authorization

Validation

Logging

Testing

Documentation

No feature ships without security review.

---

# Incident Response

Identify issue

↓

Contain

↓

Investigate

↓

Fix

↓

Deploy

↓

Review

---

# Future Security Roadmap

Multi-Factor Authentication

Single Sign-On (SSO)

IP Allow Lists

Device Management

Security Dashboard

Threat Detection

Automated Security Scanning

---

END