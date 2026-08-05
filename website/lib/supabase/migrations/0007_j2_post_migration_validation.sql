-- Read-only validation; run manually after 0006.
DO $$
BEGIN
  IF to_regclass('public.ai_actions') IS NULL
    OR to_regclass('public.appointments') IS NULL
    OR to_regclass('public.call_messages') IS NULL
    OR to_regclass('public.call_summaries') IS NULL
    OR to_regclass('public.calls') IS NULL
    OR to_regclass('public.clinic_settings') IS NULL
    OR to_regclass('public.clinics') IS NULL
    OR to_regclass('public.contacts') IS NULL
    OR to_regclass('public.lead_activity') IS NULL
    OR to_regclass('public.patients') IS NULL
    OR to_regclass('public.profiles') IS NULL THEN
    RAISE EXCEPTION 'J.2 validation failed: expected baseline table is missing';
  END IF;

  IF EXISTS (SELECT 1 FROM public.contacts WHERE clinic_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.appointments WHERE clinic_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.calls WHERE clinic_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.call_messages WHERE clinic_id IS NULL)
    OR EXISTS (SELECT 1 FROM public.clinic_settings WHERE clinic_id IS NULL) THEN
    RAISE EXCEPTION 'J.2 validation failed: unowned clinic resource remains';
  END IF;

  IF (SELECT count(*) FROM information_schema.columns
      WHERE table_schema = 'public'
        AND column_name = 'clinic_id'
        AND is_nullable = 'NO'
        AND table_name IN ('contacts', 'appointments', 'calls', 'call_messages', 'clinic_settings')) <> 5 THEN
    RAISE EXCEPTION 'J.2 validation failed: clinic ownership NOT NULL constraint drifted';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.call_messages m
    LEFT JOIN public.calls c ON c.id = m.call_id
    WHERE m.call_id IS NOT NULL AND c.id IS NULL
  ) OR EXISTS (
    SELECT 1
    FROM public.lead_activity a
    LEFT JOIN public.contacts c ON c.id = a.lead_id
    WHERE c.id IS NULL
  ) THEN
    RAISE EXCEPTION 'J.2 validation failed: ownership parent relationship is orphaned';
  END IF;

  IF (SELECT count(*)
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname IN ('ai_actions', 'appointments', 'call_messages', 'call_summaries', 'calls', 'clinic_settings', 'clinics', 'contacts', 'lead_activity', 'patients', 'profiles')
        AND c.relrowsecurity) <> 11 THEN
    RAISE EXCEPTION 'J.2 validation failed: expected RLS is not enabled';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('ai_actions', 'appointments', 'call_messages', 'call_summaries', 'calls', 'contacts', 'patients')
  ) THEN
    RAISE EXCEPTION 'J.2 validation failed: repaired table policy remains';
  END IF;
END
$$;
