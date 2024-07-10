-- Verify obookgroove:07_collection_tables on pg

BEGIN;

-- XXX Add verifications here.

SELECT * FROM "collection" WHERE false;

SELECT * FROM "collection_has_book" WHERE false;

ROLLBACK;
