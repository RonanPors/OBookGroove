-- Verify obookgroove:09_collection_share_table on pg

BEGIN;

-- XXX Add verifications here.

SELECT * FROM "collection_share" WHERE false;

ROLLBACK;
