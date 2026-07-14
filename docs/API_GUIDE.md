# PatientPilot AI API Guide

**Document:** API_GUIDE.md  
**Version:** 1.0.0  
**Status:** Production  
**Owner:** Engineering  
**Last Updated:** July 2026

---

# Purpose

This document defines every API endpoint used by PatientPilot AI.

It serves as the contract between:

- Frontend
- Backend
- AI Services
- Twilio
- Supabase
- Future Integrations

Every API endpoint must be documented before release.

---

# API Standards

## Base URL

Production

```
https://patientpilot-ai.com/api
```

Development

```
http://localhost:3000/api
```

---

# Response Standard

Every endpoint returns the same structure.

Success

```json
{
  "success": true,
  "message": "Appointment created successfully.",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Validation failed.",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
```

Never return inconsistent JSON.

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
|200|Success|
|201|Created|
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

# Authentication

Public APIs

- Contact Form
- Book Demo
- Twilio Webhooks

Protected APIs

- CRM
- Analytics
- Demo Center
- Settings
- AI Management

Authentication

Supabase Session

---

# API Modules

```
Authentication

CRM

Appointments

Patients

Analytics

Demo Center

AI

Twilio

Call Center

System
```

---

# Contact Form

## POST

```
/api/book-demo
```

Purpose

Create a new sales lead.

Authentication

No

---

Request

```json
{
  "clinicName": "Bright Smile Dental",
  "dentistName": "Dr Sarah Johnson",
  "email": "office@example.com",
  "phone": "+1-555-123-4567",
  "monthlyCalls": 350,
  "message": "Interested in AI receptionist."
}
```

---

Response

```json
{
  "success": true,
  "message": "Demo request received."
}
```

---

# Leads

## GET

```
/api/leads
```

Purpose

Retrieve CRM leads.

Authentication

Required

---

## PATCH

```
/api/leads/:id
```

Purpose

Update lead status.

Example

```json
{
  "status": "Demo Scheduled"
}
```

---

## DELETE

```
/api/leads/:id
```

Purpose

Delete a lead.

---

# Patients

## GET

```
/api/patients
```

Retrieve patient list.

---

## POST

```
/api/patients
```

Create patient.

---

## PATCH

```
/api/patients/:id
```

Update patient.

---

# Appointments

## GET

```
/api/appointments
```

Retrieve appointments.

---

## POST

```
/api/appointments
```

Book appointment.

Example

```json
{
  "patientId": "...",
  "appointmentDate": "...",
  "appointmentType": "Cleaning"
}
```

---

# AI Receptionist

## POST

```
/api/ai/respond
```

Purpose

Generate AI response.

Request

```json
{
  "conversationId": "...",
  "message": "I'd like to schedule a cleaning."
}
```

Response

```json
{
  "reply": "I'd be happy to help schedule your appointment."
}
```

---

# Transcript

## POST

```
/api/transcript
```

Purpose

Save call transcript.

---

# Live Calls

## GET

```
/api/live/calls
```

Purpose

Retrieve active calls.

---

# Twilio Voice

## POST

```
/api/twilio/voice
```

Purpose

Handle inbound phone calls.

Called by

Twilio

Returns

TwiML

---

# Twilio Status

## POST

```
/api/twilio/status
```

Purpose

Receive call status updates.

Examples

- Ringing
- Answered
- Completed
- Failed

---

# Demo Center

## GET

```
/api/demo/profiles
```

Retrieve demo profiles.

---

## POST

```
/api/demo/profiles
```

Create demo profile.

---

## PATCH

```
/api/demo/profiles/:id
```

Update profile.

---

## DELETE

```
/api/demo/profiles/:id
```

Delete profile.

---

# Demo Sessions

## POST

```
/api/demo/session/start
```

Start presentation.

---

## POST

```
/api/demo/session/end
```

Finish presentation.

---

# Conversation Library

## GET

```
/api/demo/conversations
```

Retrieve conversation scenarios.

---

# Analytics

## GET

```
/api/analytics/dashboard
```

Dashboard KPIs.

---

## GET

```
/api/analytics/calls
```

Call analytics.

---

## GET

```
/api/analytics/revenue
```

Revenue analytics.

---

# AI Knowledge

## GET

```
/api/knowledge
```

Retrieve knowledge base.

---

## POST

```
/api/knowledge
```

Create article.

---

## PATCH

```
/api/knowledge/:id
```

Update knowledge.

---

## DELETE

```
/api/knowledge/:id
```

Delete knowledge.

---

# Health Check

## GET

```
/api/health
```

Returns

```json
{
  "status": "ok"
}
```

Used by monitoring systems.

---

# Error Codes

| Code | Description |
|------|-------------|
|VALIDATION_ERROR|Invalid request|
|UNAUTHORIZED|Login required|
|NOT_FOUND|Resource missing|
|RATE_LIMITED|Too many requests|
|DATABASE_ERROR|Supabase error|
|AI_ERROR|OpenAI failed|
|TWILIO_ERROR|Telephony failure|
|UNKNOWN_ERROR|Unexpected error|

---

# Versioning

Current

```
v1
```

Future

```
/api/v2/
```

Breaking changes require a new API version.

---

# Security

- Validate every request
- Sanitize input
- Authenticate protected routes
- Never expose secrets
- Log server errors only

---

# Performance

- Paginate large datasets
- Return only required fields
- Cache read-heavy endpoints
- Compress responses
- Optimize database queries

---

# Testing Checklist

Every endpoint must be tested for:

- Success response
- Validation errors
- Unauthorized access
- Database failures
- Edge cases
- Performance

---

# Documentation Rule

Every new API endpoint must include:

- Method
- URL
- Purpose
- Authentication
- Request example
- Response example
- Error codes

No endpoint is considered complete until documented.

---

# Golden Rule

The API is the backbone of PatientPilot AI.

It should be predictable, secure, well-documented, and consistent across every module.

---

# Version History

## v1.0.0

- Initial API specification
- CRM endpoints
- AI endpoints
- Demo Center endpoints
- Analytics endpoints
- Twilio endpoints
- Security standards
- Versioning strategy