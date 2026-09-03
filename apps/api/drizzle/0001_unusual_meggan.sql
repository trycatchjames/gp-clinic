ALTER TABLE "patients" ADD COLUMN "local_record_number" text;--> statement-breakpoint
-- Backfill: assign a stable, practice-scoped sequential number to any patient
-- that predates this column, ordered by creation so numbering is deterministic.
-- No code path inserts a patient without one after this migration.
UPDATE "patients" AS p
SET "local_record_number" = 'R' || LPAD(sub.rn::text, 6, '0')
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY practice_id ORDER BY created_at, id) AS rn
  FROM "patients"
) AS sub
WHERE p.id = sub.id AND p."local_record_number" IS NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "local_record_number" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "patients_practice_record_number_idx" ON "patients" USING btree ("practice_id","local_record_number");
