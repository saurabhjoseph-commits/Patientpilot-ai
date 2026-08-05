-- service_role bypasses RLS; never grant unconditional public policies for server access.
BEGIN;

DO $$
BEGIN
  IF (select count(*) from pg_policies p join (values
    ('ai_actions', 'Allow service role full access - ai_actions'),
    ('appointments', 'Allow all with service role'),
    ('appointments', 'Allow service role full access - appointments'),
    ('call_messages', 'Allow service role full access - call_messages'),
    ('call_summaries', 'Authenticated read summaries'),
    ('call_summaries', 'Service role full access summaries'),
    ('calls', 'Allow service role full access - calls'),
    ('contacts', 'Authenticated users can view contacts'),
    ('patients', 'Authenticated read patients'),
    ('patients', 'Service role full access patients'),
    ('contacts', 'Anyone can insert contacts')
  ) as expected(tablename, policyname) on p.schemaname = 'public' and p.tablename = expected.tablename and p.policyname = expected.policyname) <> 11
    OR EXISTS (
      select 1
      from pg_policies p
      where p.schemaname = 'public'
        and p.tablename in ('ai_actions', 'appointments', 'call_messages', 'call_summaries', 'calls', 'contacts', 'patients')
        and not exists (
          select 1
          from (values
            ('ai_actions', 'Allow service role full access - ai_actions'),
            ('appointments', 'Allow all with service role'),
            ('appointments', 'Allow service role full access - appointments'),
            ('call_messages', 'Allow service role full access - call_messages'),
            ('call_summaries', 'Authenticated read summaries'),
            ('call_summaries', 'Service role full access summaries'),
            ('calls', 'Allow service role full access - calls'),
            ('contacts', 'Authenticated users can view contacts'),
            ('patients', 'Authenticated read patients'),
            ('patients', 'Service role full access patients'),
            ('contacts', 'Anyone can insert contacts')
          ) as expected(tablename, policyname)
          where expected.tablename = p.tablename
            and expected.policyname = p.policyname
        )
    ) THEN
    RAISE EXCEPTION 'J.2 RLS repair refused: verified production policy set drifted';
  END IF;
END
$$;

DROP POLICY "Allow service role full access - ai_actions" ON public.ai_actions;
DROP POLICY "Allow all with service role" ON public.appointments;
DROP POLICY "Allow service role full access - appointments" ON public.appointments;
DROP POLICY "Allow service role full access - call_messages" ON public.call_messages;
DROP POLICY "Authenticated read summaries" ON public.call_summaries;
DROP POLICY "Service role full access summaries" ON public.call_summaries;
DROP POLICY "Allow service role full access - calls" ON public.calls;
DROP POLICY "Authenticated users can view contacts" ON public.contacts;
DROP POLICY "Authenticated read patients" ON public.patients;
DROP POLICY "Service role full access patients" ON public.patients;
DROP POLICY "Anyone can insert contacts" ON public.contacts;
-- No direct anon/authenticated policies are created: protected writes and public demo submission remain server-only
-- until Supabase JWT clinic claims and column grants are explicitly introduced.

COMMIT;
