# Clinic scope boundary

`ClinicScope` is a server-only value used for ownership-sensitive writes. It may originate from a validated Identity context, the configured public-intake clinic, or trusted telephony destination mapping. Browser payloads are never a source of clinic ownership. Repositories receive the resolved scope or clinic identifier from their application service and must predicate protected reads and mutations by it.

## Telephony webhook boundary

Twilio voice, status, and AI-response callbacks enter through one server-only verification boundary. The official Twilio signature validator runs against a configured public webhook origin before destination-number clinic resolution, live-call mutation, persistence, or AI workflow execution. A `WebhookDeliveryService` claims a verified fingerprint through a Supabase repository before side effects. The database unique constraint makes that claim durable across instances; completed and failed metadata contains no payload or secret values. A scheduled server-only cleanup removes seven-day-expired records. Twilio Programmable Voice callbacks do not provide a standard signed timestamp or event identifier, so fingerprint-based replay detection is the provider-compatible control.
