-- Revert obookgroove:08_crud_functions_collection_tables from pg

BEGIN;

-- XXX Add DDLs here.

DROP FUNCTION IF EXISTS "insert_collection";

DROP FUNCTION IF EXISTS "update_collection";

DROP FUNCTION IF EXISTS "insert_collection_has_book";

DROP FUNCTION IF EXISTS "update_collection_has_book";

COMMIT;
