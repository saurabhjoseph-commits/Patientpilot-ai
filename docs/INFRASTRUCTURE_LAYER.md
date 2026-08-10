# PatientPilot AI
# INFRASTRUCTURE_LAYER

**Document:** INFRASTRUCTURE_LAYER.md
**Version:** 1.0.0
**Status:** Production
**Owner:** Engineering
**Last Updated:** July 2026

---

# Purpose

The Infrastructure Layer provides implementations for interfaces defined by the Application Layer.

It is responsible for communicating with:

- Databases
- AI providers
- Telephony
- Payment gateways
- Email providers
- Storage
- External APIs
- Logging systems

Infrastructure should contain **implementation details only**.

Business rules must never be implemented here.

---

# Architectural Position

```
Presentation

↓

Application

↓

Domain

↑

Infrastructure
```

Infrastructure depends on every inner layer.

No inner layer may depend on Infrastructure.

---

# Responsibilities

Infrastructure is responsible for:

- Database persistence
- External API integration
- Authentication providers
- Password hashing
- Token generation
- File storage
- Logging
- Background processing
- Email
- SMS
- Voice
- AI provider integration

Infrastructure is NOT responsible for:

- Business decisions
- Authorization policies
- Validation rules
- Workflow orchestration

---

# Folder Structure

```
lib/infrastructure/

database/

repositories/

identity/

events/

queue/

telephony/

ai/

billing/

notifications/

storage/

logging/

config/

cache/

monitoring/

jobs/

adapters/

services/
```

Every integration belongs to a dedicated module.

---

# Repository Implementations

Application defines interfaces.

Infrastructure implements them.

Example

```
Application

IAppointmentRepository

↓

Infrastructure

SupabaseAppointmentRepository
```

Repositories should only perform persistence.

---

# Database Layer

Current database:

```
Supabase PostgreSQL
```

Responsibilities

- CRUD
- Transactions
- Queries
- Index usage
- Optimistic concurrency

Never implement business rules inside SQL queries.

---

# Database Standards

Repositories should:

- Return domain models
- Hide SQL details
- Use transactions where appropriate
- Handle retry logic if necessary

Repositories should never return raw database rows.

---

# Identity Infrastructure

Components

```
PasswordHasher

JwtTokenProvider

CurrentUserProvider

SessionRepository

AuthenticationRepository
```

Responsibilities

- Password hashing
- JWT generation
- Refresh tokens
- Session validation
- Authentication persistence

---

# AI Infrastructure

Current Provider

```
OpenAI
```

Future Providers

- Anthropic
- Google Gemini
- Azure OpenAI

Architecture

```
IAIProvider

↓

OpenAIProvider

↓

Future Providers
```

The Application Layer depends only on `IAIProvider`.

---

# Telephony

Current Provider

```
Twilio
```

Future

- Telnyx
- Vonage
- Plivo

Architecture

```
IVoiceProvider

↓

TwilioProvider
```

Future providers can be added without changing business logic.

---

# Billing

Current Provider

```
Stripe
```

Architecture

```
IPaymentGateway

↓

StripeGateway
```

Future providers

- Razorpay
- Square
- PayPal

Billing workflows remain provider-independent.

---

# Notification Services

Supported channels

```
Email

SMS

Voice

Push (future)

WhatsApp (future)
```

Interfaces

```
IEmailService

ISmsService

INotificationService
```

Delivery mechanisms are hidden behind interfaces.

---

# Storage

Responsibilities

- Documents
- Voice recordings
- AI transcripts
- Images
- Exports

Interfaces

```
IStorageProvider
```

Implementations

- Supabase Storage
- S3 (future)
- Azure Blob (future)

---

# External APIs

Infrastructure integrates with:

- Google Calendar
- Microsoft 365
- Open Dental
- Dentrix
- Eaglesoft
- Insurance APIs
- Future CRM integrations

Every integration must have an adapter.

---

# Country Adapters

The platform supports:

- United States
- Australia
- India

Architecture

```
ICountryAdapter

↓

USAdapter

AustraliaAdapter

IndiaAdapter
```

Responsibilities

- Currency
- Taxes
- Phone formatting
- Time zones
- Holidays
- Compliance

Business logic must remain country-independent.

---

# Dependency Injection

All Infrastructure services are registered through the DI container.

Example

```
ServiceRegistry

↓

Register Repository

↓

Register Providers

↓

Register Services
```

No service should instantiate another implementation directly.

---

# Event Publishing

Infrastructure provides event transport.

Possible implementations

- In-memory
- Database
- Redis
- Azure Service Bus
- AWS SNS/SQS

Application publishes events.

Infrastructure delivers them.

---

# Background Jobs

Long-running work should execute asynchronously.

Examples

- Appointment reminders
- AI follow-ups
- Recall campaigns
- Analytics aggregation
- Email delivery
- SMS delivery
- Report generation

Future implementations may use:

- BullMQ
- Azure Queue
- AWS SQS
- Cloud Tasks

---

# Caching

Supported cache types

- Memory
- Redis
- Edge Cache

Typical cached data

- Clinic configuration
- Feature flags
- Business hours
- Provider schedules
- AI prompts

Never cache sensitive authentication information without encryption.

---

# Logging

Infrastructure provides centralized logging.

Supported levels

```
Trace

Debug

Information

Warning

Error

Critical
```

Production logging should support structured JSON output.

Never log:

- Passwords
- JWTs
- API keys
- PHI
- Sensitive payment information

---

# Monitoring

Infrastructure should expose:

- Health checks
- Dependency status
- Database connectivity
- AI provider availability
- Telephony status
- Queue health

Future integrations

- OpenTelemetry
- Grafana
- Datadog
- Azure Monitor

---

# Configuration

Configuration should come from:

- Environment variables
- Secret managers
- Tenant configuration
- Feature flags

Never hardcode secrets.

---

# Security

Infrastructure enforces:

- TLS
- Encryption at rest
- Secret management
- API authentication
- Key rotation
- Rate limiting
- Secure cookies

All credentials remain outside source control.

---

# Error Handling

Infrastructure converts provider-specific errors into application-friendly exceptions.

Example

```
Stripe Exception

↓

PaymentGatewayException
```

Application should never know provider-specific exception types.

---

# Performance

Infrastructure should:

- Reuse connections
- Pool database clients
- Batch requests
- Minimize network calls
- Retry transient failures
- Apply exponential backoff where appropriate

---

# Testing

Infrastructure tests should include:

- Repository tests
- Integration tests
- Provider mocks
- Contract tests
- Connectivity tests

Application tests should never require live external services.

---

# Future Evolution

The Infrastructure Layer should allow replacement of any provider without changing:

- Domain
- Application
- Business workflows

Provider replacement should require only a new implementation of the corresponding interface.

---

# Definition of Done

An Infrastructure component is complete when:

✓ Implements the required interface

✓ Handles provider-specific failures

✓ Supports dependency injection

✓ Includes integration tests

✓ Is fully documented

✓ Does not contain business rules

✓ Can be replaced without affecting inner layers

---

# Engineering Goal

The Infrastructure Layer isolates PatientPilot AI from external technologies.

It provides reliable, secure, and replaceable implementations for every external dependency while preserving the independence of the Domain and Application layers.

This separation enables the platform to evolve, adopt new technologies, and scale globally without compromising business logic or architectural integrity.

---

END