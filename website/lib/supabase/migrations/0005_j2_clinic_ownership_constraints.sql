-- Apply only after 0003 and 0004 complete successfully.
BEGIN;
SET LOCAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;

DO $$
BEGIN
  IF to_regclass('public.contacts') IS NULL
    OR to_regclass('public.appointments') IS NULL
    OR to_regclass('public.calls') IS NULL
    OR to_regclass('public.call_messages') IS NULL
    OR to_regclass('public.clinic_settings') IS NULL THEN
    RAISE EXCEPTION 'J.2 constraints refused: required tables are missing';
  END IF;

  LOCK TABLE public.contacts, public.appointments, public.calls,
    public.call_messages, public.clinic_settings IN SHARE ROW EXCLUSIVE MODE;

  IF exists (select 1 from public.contacts where clinic_id is null)
    or exists (select 1 from public.appointments where clinic_id is null)
    or exists (select 1 from public.calls where clinic_id is null)
    or exists (select 1 from public.call_messages where clinic_id is null)
    or exists (select 1 from public.clinic_settings where clinic_id is null) then
    RAISE EXCEPTION 'J.2 constraints refused: clinic ownership contains NULL values';
  END IF;
END
$$;

ALTER TABLE public.contacts ALTER COLUMN clinic_id SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN clinic_id SET NOT NULL;
ALTER TABLE public.calls ALTER COLUMN clinic_id SET NOT NULL;
ALTER TABLE public.call_messages ALTER COLUMN clinic_id SET NOT NULL;
ALTER TABLE public.clinic_settings ALTER COLUMN clinic_id SET NOT NULL;

COMMIT;
