-- Revert obookgroove:06_crud_functions_comment_table from pg

BEGIN;

-- XXX Add DDLs here.

DROP FUNCTION IF EXISTS "insert_comment";

DROP FUNCTION IF EXISTS "update_comment";

COMMIT;
