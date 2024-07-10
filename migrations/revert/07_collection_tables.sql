-- Revert obookgroove:07_collection_tables from pg

BEGIN;

-- XXX Add DDLs here.

DROP TABLE IF EXISTS "collection", "collection_has_book";

COMMIT;
