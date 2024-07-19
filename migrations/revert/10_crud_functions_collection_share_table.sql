-- Revert obookgroove:10_crud_functions_collection_share_table from pg

BEGIN;

-- XXX Add DDLs here.

DROP FUNCTION IF EXISTS "insert_collection_share";

DROP FUNCTION IF EXISTS "update_collection_share";

COMMIT;
