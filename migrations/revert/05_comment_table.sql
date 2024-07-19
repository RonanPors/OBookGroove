-- Revert obookgroove:05_comment_table from pg

BEGIN;

-- XXX Add DDLs here.

DROP TABLE IF EXISTS "comment";

COMMIT;
