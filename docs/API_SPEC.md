# PatientPilot AI
# API_SPEC

## J.2 protected operational APIs

`/api/appointments`, `/api/calls`, `/api/transcript`, and `/api/leads/[id]` require Identity authentication and the relevant permission. Their trusted clinic scope originates from Identity context, never a request payload. `/api/book-demo` remains public but resolves the configured intake clinic server-side. `/api/test-console` is unavailable in production.

**Document:** API_SPEC.md
**Version:** 1.0.0
**Status:** Living Document
**Owner:** Engineering
**Last Updated:** July 2026

---

# Purpose

This document defines the API specification for PatientPilot AI.

It is the authoritative reference for:

- REST endpoints
- Request formats
- Response formats
- Authentication
- Authorization
- Error handling
- Pagination
- Filtering
- Versioning
- Idempotency
- Webhooks

All APIs must comply with this specification.

---

# API Philosophy

PatientPilot AI follows an API-first architecture.

Every business capability should be accessible through APIs.

Consumers include:

- Web Application
- AI Conversation Engine
- Admin Dashboard
- Mobile Apps (future)
- Third-party Integrations
- Automation Workflows

---

# Base URL

Development

```
http://localhost:3000/api
```

Production

```
https://patientpilot-ai.com/api
```

Versioning

```
/api/v1/
```

Future versions

```
/api/v2/
```

Never introduce breaking changes within a major API version.

---

# Content Type

Request

```
Content-Type: application/json
```

Response

```
application/json
```

File uploads

```
multipart/form-data
```

---

# Authentication

Protected APIs require:

```
Authorization: Bearer <JWT>
```

Public APIs

- Book Demo
- AI Public Callbacks
- Webhooks (signature validation required)

---

# Authorization

Authorization is role and permission based.

Examples

```
Clinic Owner

Administrator

Dentist

Receptionist

Manager
```

Permissions are evaluated in the Application Layer.

---

# Standard Response

Successful Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email address is invalid."
  }
}
```

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
|200|Success|
|201|Created|
|202|Accepted|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Error|
|429|Rate Limited|
|500|Internal Server Error|

---

# API Modules

```
Authentication

Clinics

Users

Providers

Patients

Appointments

CRM

AI

Analytics

Billing

Notifications

Administration
```

---

# Authentication API

## Login

POST

```
/api/v1/auth/login
```

Request

```json
{
  "email": "admin@clinic.com",
  "password": "********"
}
```

Response

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900
  }
}
```

---

## Refresh Token

POST

```
/api/v1/auth/refresh
```

---

## Logout

POST

```
/api/v1/auth/logout
```

---

## Change Password

POST

```
/api/v1/auth/change-password
```

---

# Clinic API

GET

```
/api/v1/clinics
```

GET

```
/api/v1/clinics/{id}
```

POST

```
/api/v1/clinics
```

PUT

```
/api/v1/clinics/{id}
```

DELETE

```
/api/v1/clinics/{id}
```

---

# Patient API

GET

```
/api/v1/patients
```

Supports

- Search
- Pagination
- Sorting
- Filtering

POST

```
/api/v1/patients
```

GET

```
/api/v1/patients/{id}
```

PUT

```
/api/v1/patients/{id}
```

DELETE

```
/api/v1/patients/{id}
```

---

# Provider API

```
GET /providers

POST /providers

PUT /providers/{id}

DELETE /providers/{id}
```

---

# Appointment API

```
GET /appointments

POST /appointments

PUT /appointments/{id}

DELETE /appointments/{id}
```

Additional endpoints

```
POST /appointments/{id}/cancel

POST /appointments/{id}/reschedule

POST /appointments/{id}/confirm

POST /appointments/{id}/check-in
```

---

# CRM API

Resources

```
Leads

Activities

Pipelines

Stages

Opportunities

Quotes

Estimates
```

REST endpoints follow:

```
GET

POST

PUT

DELETE
```

---

# AI API

Conversation

```
POST /ai/conversation/start

POST /ai/conversation/message

POST /ai/conversation/end
```

Transcript

```
GET /ai/conversations/{id}/transcript
```

AI Analysis

```
POST /ai/analyze
```

---

# Telephony API

Incoming Call

```
POST /twilio/voice
```

Call Status

```
POST /twilio/status
```

Recording Callback

```
POST /twilio/recording
```

---

# Analytics API

Dashboard

```
GET /analytics/dashboard
```

KPIs

```
GET /analytics/kpis
```

Reports

```
GET /analytics/reports
```

---

# Billing API

```
GET /subscriptions

POST /subscriptions

GET /invoices

POST /payments
```

---

# Notification API

```
POST /notifications/email

POST /notifications/sms

POST /notifications/voice
```

---

# Search

Search endpoints should support:

```
?q=

&page=

&pageSize=

&sort=

&direction=
```

Example

```
GET /patients?q=john&page=2&pageSize=25
```

---

# Pagination

Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 2,
    "pageSize": 25,
    "totalItems": 145,
    "totalPages": 6
  }
}
```

---

# Filtering

Example

```
GET /appointments?status=confirmed
```

Multiple filters

```
status

provider

patient

date

service
```

---

# Sorting

Example

```
?sort=createdAt&direction=desc
```

---

# Validation

Every API validates:

- Required fields
- Data types
- Email
- Phone
- UUID
- Dates
- Business rules

Validation errors return:

```
422 Unprocessable Entity
```

---

# Idempotency

Required for:

- Payments
- Appointment booking
- Subscription creation

Header

```
Idempotency-Key
```

Duplicate requests must return the original successful response.

---

# Rate Limiting

Public APIs

```
60 requests/minute/IP
```

Authenticated APIs

```
Configurable by plan
```

AI endpoints may use stricter limits.

---

# Error Codes

Examples

```
VALIDATION_ERROR

UNAUTHORIZED

FORBIDDEN

NOT_FOUND

CONFLICT

RATE_LIMITED

SUBSCRIPTION_LIMIT

AI_PROVIDER_ERROR

PAYMENT_FAILED
```

Errors should be stable and documented.

---

# Webhooks

Supported providers

- Stripe
- Twilio
- Future Integrations

Requirements

- HTTPS only
- Signature verification
- Idempotent processing
- Retry support
- Event logging

---

# Security

All APIs should enforce:

- JWT authentication
- HTTPS
- Rate limiting
- Input validation
- Output sanitization
- Audit logging
- Least privilege

Sensitive information must never be returned in responses.

---

# API Versioning

Rules

- Breaking changes require a new major version.
- New optional fields are non-breaking.
- Deprecated endpoints remain supported through the defined lifecycle.

---

# OpenAPI

The REST API should be documented using OpenAPI 3.1.

Deliverables

```
openapi.yaml

Swagger UI

Redoc
```

The OpenAPI specification should be generated from the implementation whenever practical to keep documentation synchronized.

---

# Testing

Every endpoint should have:

- Unit tests
- Integration tests
- Authorization tests
- Validation tests
- Contract tests

Critical APIs should also have end-to-end coverage.

---

# Definition of Done

An API is complete when:

✓ Route implemented

✓ Use case connected

✓ Validation complete

✓ Authorization applied

✓ Response matches specification

✓ OpenAPI updated

✓ Tests passing

✓ Documentation updated

---

# Engineering Goal

The PatientPilot AI API should provide a stable, secure, versioned, and well-documented contract between all platform components.

The API must remain consistent across modules, support future integrations, and enable independent evolution of the frontend, AI engine, and external partners while preserving backward compatibility.

---

END
