-- Revert obookgroove:02_crud_functions from pg

BEGIN;

-- XXX Add DDLs here.

DROP FUNCTION IF EXISTS "insert_user";

DROP FUNCTION IF EXISTS "insert_book";

DROP FUNCTION IF EXISTS "insert_user_has_book";

DROP FUNCTION IF EXISTS "update_user";

DROP FUNCTION IF EXISTS "update_book";

DROP FUNCTION IF EXISTS "update_user_has_book";

COMMIT;