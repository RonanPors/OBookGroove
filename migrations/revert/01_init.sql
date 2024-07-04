-- Revert obookgroove:01_init from pg

BEGIN;

-- XXX Add DDLs here.

DROP TABLE IF EXISTS "user", "book", "user_has_book";

COMMIT;