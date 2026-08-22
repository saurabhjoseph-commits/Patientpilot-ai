-- H3.1C READ-ONLY DATA PREFLIGHT. Run before applying 0020_h2 appointment linkage.
-- This intentionally references only the pre-0020 appointment contract. The linkage
-- columns do not exist yet in the reported staging schema.
select id as appointment_id, clinic_id, 'MISSING_CLINIC'::text as issue
from public.appointments where clinic_id is null
union all
select id, clinic_id, 'INVALID_APPOINTMENT_TIME'
from public.appointments where appointment_time !~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9](?:[.][0-9]+)?)?$'
order by clinic_id, appointment_id;
