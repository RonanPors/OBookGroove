-- Verify obookgroove:01_init on pg

BEGIN;

-- XXX Add verifications here.

SELECT * FROM "user" WHERE false;

SELECT * FROM "book" WHERE false;

SELECT * FROM "user_has_book" WHERE false;

ROLLBACK;