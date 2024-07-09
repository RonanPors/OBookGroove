-- Verify obookgroove:03_survey_table on pg

BEGIN;

-- XXX Add verifications here.

SELECT * FROM "survey" WHERE false;

ROLLBACK;
