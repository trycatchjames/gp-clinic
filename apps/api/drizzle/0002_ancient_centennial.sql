-- The patient domain names three alert types; only two were modelled. An access
-- restriction is the authorisation fact behind a sensitive record, so it belongs
-- beside the others rather than as a second, parallel mechanism.
--
-- No index is added here: Postgres refuses to use a new enum value in the same
-- transaction that adds it, and the existing (patient_id, category) index on
-- patient_alerts already serves the search join.
ALTER TYPE "public"."alert_category" ADD VALUE 'access_restriction';
