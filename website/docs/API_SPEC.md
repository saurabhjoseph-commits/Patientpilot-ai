# API Security Specification

## Telephony provider callbacks

| Route | Classification | Requirement |
| --- | --- | --- |
| `POST /api/twilio/voice` | Verified provider webhook | Valid `X-Twilio-Signature`; trusted destination mapping; duplicate acknowledgement. |
| `POST /api/twilio/status` | Verified provider webhook | Valid `X-Twilio-Signature`; trusted destination mapping; duplicate acknowledgement. |
| `POST /api/ai/respond` | Verified provider webhook | Valid `X-Twilio-Signature` before AI workflow and persistence. |
| `POST /api/twilio` | Obsolete route | Always returns `410 Gone`. |
| `/api/calls`, `/api/transcript` | Authenticated staff APIs | Identity permission and clinic scope required. |
| `GET /api/live/calls` | Authenticated staff API | Identity `CallsRead` permission required. |

Twilio signatures are checked using the official SDK against `TWILIO_WEBHOOK_BASE_URL` plus the request path/query. The endpoint never accepts a clinic identifier from the provider payload. Verified callback fingerprints are atomically claimed in `webhook_deliveries`; the unique `(provider, fingerprint)` constraint prevents a second workflow execution. Classic Programmable Voice callbacks have no standard signed timestamp/event ID, so the fingerprint retention window is seven days.

## Staging Twilio Console configuration

Set `TWILIO_WEBHOOK_BASE_URL` to the exact deployed staging HTTPS origin, with no path, query, or fragment. Configure Twilio with the same origin:

- Incoming voice: `${TWILIO_WEBHOOK_BASE_URL}/api/twilio/voice`
- Status callback: `${TWILIO_WEBHOOK_BASE_URL}/api/twilio/status`
- Gather continuation: `${TWILIO_WEBHOOK_BASE_URL}/api/ai/respond`

The current local configuration is not a deployable staging origin, so no live Twilio callback was sent from this workspace.

Telnyx has no enabled route in this deployment. Introducing one requires raw-body signature verification, timestamp-window enforcement, and durable event-id deduplication before activation.

## Password recovery

`POST /api/auth/password-recovery` always returns the same neutral message for valid, unknown, rate-limited, and provider-error requests. It requests the closed `/auth/callback?next=/reset-password` redirect. The Supabase **Reset Password** email template must link to that callback using `{{ .TokenHash }}` and `type=recovery`; the callback accepts only that exact type and `next=/reset-password`, verifies the one-time token server-side with `verifyOtp`, and establishes the SSR recovery session. Invalid, expired, and reused links redirect to the reset page in an invalid state without exposing token details. The reset page then calls `updateUser({ password })` and submits the short-lived recovery access token to the server-only completion route, which validates that token with Supabase and updates the matching Identity credential hash without logging the password or token.
