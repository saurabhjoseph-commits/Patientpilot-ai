# PatientPilot AI v2

# API Specification

Version: 2.0

---

# Overview

All APIs follow REST principles.

Authentication is required for every protected endpoint.

All responses use JSON.

API Version

/api/v1/

Future versions

/api/v2/

/api/v3/

---

# Authentication

Authentication Provider

Supabase Auth

Authorization

Bearer Token

Session Cookie

Protected APIs require a valid authenticated user.

---

# Response Format

Success

{
  "success": true,
  "data": {}
}

Error

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address."
  }
}

---

# Authentication APIs

POST

/api/v1/auth/login

Purpose

Authenticate user.

POST

/api/v1/auth/signup

Purpose

Create account.

POST

/api/v1/auth/logout

Purpose

Logout.

POST

/api/v1/auth/forgot-password

Purpose

Send password reset email.

POST

/api/v1/auth/reset-password

Purpose

Update password.

GET

/api/v1/auth/me

Purpose

Return current user.

---

# Clinic APIs

GET

/api/v1/clinics

List clinics.

GET

/api/v1/clinics/{id}

Clinic details.

POST

/api/v1/clinics

Create clinic.

PUT

/api/v1/clinics/{id}

Update clinic.

DELETE

/api/v1/clinics/{id}

Deactivate clinic.

---

# Patient APIs

GET

/api/v1/patients

List patients.

GET

/api/v1/patients/{id}

Patient details.

POST

/api/v1/patients

Create patient.

PUT

/api/v1/patients/{id}

Update patient.

DELETE

/api/v1/patients/{id}

Archive patient.

---

# Appointment APIs

GET

/api/v1/appointments

POST

/api/v1/appointments

PUT

/api/v1/appointments/{id}

DELETE

/api/v1/appointments/{id}

PATCH

/api/v1/appointments/{id}/status

---

# Call APIs

GET

/api/v1/calls

GET

/api/v1/calls/{id}

POST

/api/v1/calls

POST

/api/v1/calls/webhook

Twilio webhook.

POST

/api/v1/calls/transcript

Save transcript.

---

# AI APIs

POST

/api/v1/ai/chat

POST

/api/v1/ai/voice

POST

/api/v1/ai/intent

POST

/api/v1/ai/summarize

GET

/api/v1/ai/settings

PUT

/api/v1/ai/settings

---

# Staff APIs

GET

/api/v1/staff

POST

/api/v1/staff

PUT

/api/v1/staff/{id}

DELETE

/api/v1/staff/{id}

POST

/api/v1/staff/invite

---

# Billing APIs

GET

/api/v1/subscription

POST

/api/v1/subscription

GET

/api/v1/invoices

POST

/api/v1/webhooks/stripe

---

# Analytics APIs

GET

/api/v1/dashboard

GET

/api/v1/revenue

GET

/api/v1/call-analytics

GET

/api/v1/appointment-analytics

GET

/api/v1/usage

---

# Notification APIs

POST

/api/v1/sms

POST

/api/v1/email

POST

/api/v1/reviews

---

# Admin APIs

GET

/api/v1/admin/dashboard

GET

/api/v1/admin/clinics

GET

/api/v1/admin/users

GET

/api/v1/admin/subscriptions

GET

/api/v1/admin/system-health

---

# HTTP Status Codes

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

---

# Validation Rules

Every endpoint validates

Authentication

Authorization

Clinic Ownership

Request Body

Rate Limit

---

# Rate Limiting

Public APIs

60 requests/minute

Authenticated APIs

300 requests/minute

Webhooks

Unlimited

Protected by signature validation.

---

# API Security

HTTPS Only

JWT Validation

CSRF Protection

Input Validation

SQL Injection Protection

Rate Limiting

Request Logging

Audit Logging

---

# API Standards

Use plural resource names.

Use UUIDs.

Never expose internal IDs.

Never expose service role keys.

Return consistent error responses.

Every endpoint must include authentication and authorization checks.

---

END