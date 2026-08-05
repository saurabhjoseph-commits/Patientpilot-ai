-- REVIEW ONLY: apply manually after J.2 in the intended environment.
-- Stores only verified delivery metadata; never store signatures, tokens, or webhook payloads.
BEGIN;

CREATE TABLE public.webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('twilio')),
  fingerprint text NOT NULL CHECK (char_length(fingerprint) = 64),
  route text NOT NULL,
  call_sid text,
  received_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  status text NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  completed_at timestamp with time zone,
  failure_code text,
  CONSTRAINT webhook_deliveries_provider_fingerprint_key UNIQUE (provider, fingerprint)
);

CREATE INDEX webhook_deliveries_expires_at_idx ON public.webhook_deliveries (expires_at);
CREATE INDEX webhook_deliveries_call_sid_idx ON public.webhook_deliveries (call_sid);

ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
-- No policy is created. Application service-role access bypasses RLS; browser access is denied.

COMMIT;
