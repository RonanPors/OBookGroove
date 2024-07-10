-- Verify obookgroove:05_comment_table on pg

BEGIN;

-- XXX Add verifications here.

SELECT * FROM "comment" WHERE false;

ROLLBACK;
