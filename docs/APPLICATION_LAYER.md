# PatientPilot AI
# APPLICATION_LAYER

**Document:** APPLICATION_LAYER.md
**Version:** 1.0.0
**Status:** Production
**Owner:** Engineering
**Last Updated:** July 2026

---

# Purpose

The Application Layer coordinates business operations.

It is responsible for executing use cases by orchestrating domain entities, repositories, external services, authorization, and workflows.

The Application Layer contains no UI code and no infrastructure-specific implementations.

---

# Responsibilities

The Application Layer is responsible for:

- Executing business use cases
- Orchestrating workflows
- Coordinating repositories
- Authorization
- Validation
- Publishing domain events
- Returning DTOs
- Transaction management

It is NOT responsible for:

- Rendering UI
- Database queries
- HTTP responses
- Framework logic
- External SDK implementation

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

The Application Layer depends only on the Domain Layer.

Infrastructure implements interfaces defined here.

---

# Folder Structure

```
lib/application/

commands/

queries/

dto/

interfaces/

repositories/

services/

policies/

validators/

events/

workflows/

mappers/

use-cases/
```

Each module should remain focused.

---

# Use Cases

A Use Case represents one business capability.

Examples

```
AuthenticateUser

CreatePatient

UpdatePatient

BookAppointment

CancelAppointment

RescheduleAppointment

CreateLead

ConvertLead

GenerateQuote

StartConversation

CompleteConversation

SendReminder

RecoverMissedCall
```

Every business operation should have its own use case.

---

# Use Case Rules

Each use case should:

- Perform one responsibility
- Receive a Request DTO
- Return a Response DTO
- Be testable
- Be framework independent
- Be transaction aware
- Publish domain events when appropriate

Avoid combining unrelated workflows.

---

# Standard Structure

```
AuthenticateUser/

AuthenticateUserRequest.ts

AuthenticateUserResponse.ts

AuthenticateUserUseCase.ts

index.ts
```

The same convention applies to every use case.

---

# Request DTO

Request DTOs define the required input.

Example

```
AuthenticateUserRequest

email

password

tenantId
```

DTOs should contain no business logic.

---

# Response DTO

Response DTOs define the output returned by the use case.

Example

```
AuthenticateUserResponse

accessToken

refreshToken

user

permissions
```

Response DTOs should expose only the data required by consumers.

---

# Commands

Commands modify application state.

Examples

```
CreateAppointment

CancelAppointment

InviteUser

CreateClinic

RecordPayment
```

Commands produce side effects.

---

# Queries

Queries return data without modifying state.

Examples

```
GetAppointment

SearchPatients

GetDashboard

GetAnalytics

ListProviders
```

Queries must never modify data.

---

# Repository Interfaces

Repositories abstract persistence.

Example

```
IPatientRepository

IAppointmentRepository

ILeadRepository

IConversationRepository
```

Repositories expose business-oriented methods rather than database-specific operations.

---

# Service Interfaces

Services represent infrastructure capabilities.

Examples

```
ITokenProvider

IPasswordHasher

IEmailService

ISmsService

IVoiceProvider

IAIProvider

IStorageProvider

IPaymentGateway
```

Concrete implementations belong in Infrastructure.

---

# Validators

Validators perform application-level validation.

Responsibilities include:

- Required fields
- Format validation
- Business preconditions
- Cross-field validation

Validators should not access infrastructure directly.

---

# Authorization Policies

Policies determine whether an operation is allowed.

Examples

```
CanManageAppointments

CanManagePatients

CanViewAnalytics

CanManageBilling

CanManageUsers
```

Authorization logic should remain centralized.

---

# Workflow Orchestration

Complex business processes are orchestrated through workflows.

Example

```
Incoming Phone Call

↓

Authenticate Clinic

↓

Load AI Configuration

↓

Create Conversation

↓

Detect Intent

↓

Execute Use Case

↓

Generate Response

↓

Save Transcript

↓

Publish Events
```

Individual use cases remain focused while workflows coordinate them.

---

# Domain Events

Application publishes events after successful operations.

Examples

```
AppointmentBooked

AppointmentCancelled

LeadCreated

LeadConverted

PatientRegistered

ConversationCompleted

PaymentReceived
```

Events should be immutable.

---

# Transactions

A use case should execute within a transaction whenever multiple repositories are modified.

Example

```
Book Appointment

↓

Save Appointment

↓

Reserve Provider Slot

↓

Create Activity

↓

Publish Event

↓

Commit
```

Rollback if any step fails.

---

# Error Handling

The Application Layer should throw domain-specific exceptions.

Examples

```
AppointmentConflictException

UnauthorizedOperationException

PatientNotFoundException

ClinicNotFoundException

SubscriptionLimitExceededException
```

Avoid exposing infrastructure errors.

---

# Mapping

The Application Layer maps:

```
DTO

↓

Domain

↓

DTO
```

Persistence mapping belongs to Infrastructure.

---

# Dependency Injection

All dependencies are injected.

Example

```
BookAppointmentUseCase

↓

IAppointmentRepository

↓

IProviderRepository

↓

IEventPublisher
```

Never instantiate dependencies directly inside use cases.

---

# Logging

Use cases should log meaningful business events.

Examples

- Appointment booked
- Payment processed
- User authenticated
- Conversation escalated

Do not log sensitive information.

---

# AI Integration

The AI system interacts with the application through use cases.

Example

```
AI Intent

↓

BookAppointmentUseCase

↓

Appointment Repository

↓

AppointmentBooked Event
```

AI must never bypass business rules.

---

# Scheduling Integration

Scheduling workflows should use dedicated application services.

Example

```
BookAppointment

↓

AvailabilityService

↓

ConflictValidator

↓

AppointmentRepository
```

Business rules remain centralized.

---

# Billing Integration

Billing workflows coordinate:

- Subscription validation
- Usage tracking
- Payment processing
- Invoice generation

Business logic remains inside the application layer.

---

# Notification Integration

Notifications should be triggered through events.

Supported channels:

- Email
- SMS
- Voice
- WhatsApp (future)
- Push Notifications (future)

The originating use case should not know delivery details.

---

# Performance Guidelines

Use cases should:

- Execute quickly
- Minimize repository calls
- Avoid unnecessary allocations
- Prefer batching where practical

Long-running operations should execute asynchronously.

---

# Testing

Every use case should have:

- Unit tests
- Repository mocks
- Policy tests
- Validation tests

Infrastructure should never be required to test application logic.

---

# Naming Standards

Use Cases

```
BookAppointmentUseCase
```

Requests

```
BookAppointmentRequest
```

Responses

```
BookAppointmentResponse
```

Policies

```
AppointmentPolicy
```

Validators

```
AppointmentValidator
```

Repositories

```
IAppointmentRepository
```

---

# Definition of Done

A new application module is complete when:

✓ Use case implemented

✓ DTOs created

✓ Validation complete

✓ Authorization applied

✓ Repository interfaces defined

✓ Events published

✓ Unit tests pass

✓ Documentation updated

---

# Engineering Goal

The Application Layer is the orchestration engine of PatientPilot AI.

Every business capability should be represented by a dedicated use case, coordinated through clear interfaces, protected by policies, validated consistently, and executed independently of infrastructure.

Maintaining these boundaries ensures the platform remains modular, testable, scalable, and ready for future AI-driven workflows.

---

END