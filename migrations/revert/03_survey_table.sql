-- Revert obookgroove:03_survey_table from pg

BEGIN;

-- XXX Add DDLs here.

DROP TABLE IF EXISTS "survey";

COMMIT;
