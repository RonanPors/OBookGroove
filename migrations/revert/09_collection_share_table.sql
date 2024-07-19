-- Revert obookgroove:09_collection_share_table from pg

BEGIN;

-- XXX Add DDLs here.

DROP TABLE IF EXISTS "collection_share";

COMMIT;
