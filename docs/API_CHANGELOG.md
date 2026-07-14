# PatientPilot AI API Changelog

**Document:** API_CHANGELOG.md  
**Version:** 1.0.0  
**Status:** Active  
**Owner:** Engineering  
**Last Updated:** July 2026

---

# Purpose

This document tracks all changes to the PatientPilot AI API.

It records:

- New endpoints
- Endpoint updates
- Request changes
- Response changes
- Authentication changes
- Deprecations
- Breaking changes
- Bug fixes

Unlike `CHANGELOG.md`, this document focuses **only on APIs**.

---

# Versioning Policy

API Version

```
v1
```

Future

```
v2
```

Breaking changes always require a new API version.

Minor improvements remain within the same version.

---

# Change Categories

## Added

New endpoints.

---

## Changed

Modified request or response.

---

## Fixed

Bug fixes.

---

## Deprecated

Endpoint scheduled for removal.

---

## Removed

Endpoint removed.

---

## Security

Authentication changes.

Validation improvements.

Permission updates.

---

# Template

Every entry follows this format.

---

## YYYY-MM-DD

### Added

-

### Changed

-

### Fixed

-

### Deprecated

-

### Removed

-

### Security

-

---

# API History

---

# 2026-07-14

## Added

### CRM

```
PATCH /api/leads/:id
```

Allows updating lead status.

---

### AI

```
POST /api/ai/respond
```

Generates AI receptionist responses.

---

### Transcript

```
POST /api/transcript
```

Stores AI call transcripts.

---

### Live Monitor

```
GET /api/live/calls
```

Returns active AI calls.

---

### Twilio

```
POST /api/twilio/voice
```

Handles inbound calls.

---

```
POST /api/twilio/status
```

Receives Twilio status callbacks.

---

## Changed

None.

---

## Fixed

Initial API implementation.

---

## Deprecated

None.

---

## Removed

None.

---

## Security

Protected admin routes with authentication.

---

# Upcoming

These endpoints are planned.

---

## Demo Center

```
GET /api/demo/profiles
```

Retrieve demo profiles.

---

```
POST /api/demo/profiles
```

Create profile.

---

```
PATCH /api/demo/profiles/:id
```

Update profile.

---

```
DELETE /api/demo/profiles/:id
```

Delete profile.

---

## Demo Sessions

```
POST /api/demo/session/start
```

---

```
POST /api/demo/session/end
```

---

## Conversation Library

```
GET /api/demo/conversations
```

---

## Analytics

```
GET /api/analytics/dashboard
```

---

```
GET /api/analytics/revenue
```

---

## AI Knowledge

```
GET /api/knowledge
```

---

```
POST /api/knowledge
```

---

```
PATCH /api/knowledge/:id
```

---

```
DELETE /api/knowledge/:id
```

---

# Breaking Change Policy

Breaking changes include:

- Request body modifications
- Response schema changes
- Authentication requirements
- URL changes
- Removed fields
- Removed endpoints

Breaking changes require:

1. New API version
2. Migration guide
3. Release notes
4. Update API_GUIDE.md

---

# Deprecation Policy

Deprecated endpoints remain available for one major version.

Example

Current

```
/api/v1/leads
```

Future

```
/api/v2/leads
```

The v1 endpoint will be marked as deprecated before removal.

---

# Documentation Checklist

Every API change must update:

- API_GUIDE.md
- API_CHANGELOG.md
- CHANGELOG.md (if customer-visible)
- RELEASE_NOTES.md (if customer-visible)

---

# Review Checklist

Before releasing an API change:

- Request validated
- Response documented
- Authentication verified
- Error handling tested
- Database migration complete
- Backward compatibility reviewed

---

# Future Enhancements

When PatientPilot AI reaches Version 2:

- OpenAPI (Swagger) specification
- API Explorer
- Postman Collection
- SDK generation
- Rate limit documentation
- Webhook documentation

---

# Golden Rule

Every API change must be documented before deployment.

Undocumented APIs are considered incomplete.

---

# Version History

## v1.0.0

- Initial API changelog
- Versioning policy
- Change categories
- Initial endpoint history
- Future endpoint roadmap