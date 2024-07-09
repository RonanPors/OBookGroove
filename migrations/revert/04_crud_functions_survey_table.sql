-- Revert obookgroove:04_crud_functions_survey_table from pg

BEGIN;

-- XXX Add DDLs here.

DROP FUNCTION IF EXISTS "insert_survey";

DROP FUNCTION IF EXISTS "update_survey";

COMMIT;
