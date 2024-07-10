-- Verify obookgroove:08_crud_functions_collection_tables on pg

BEGIN;

-- XXX Add verifications here.

SELECT *
FROM insert_collection (
        '{"user_id": "1", "collection_name": "action"}'::json
    )
WHERE
    false;

SELECT *
FROM insert_collection_has_book (
        '{"collection_id": "1", "book_id": "1"}'::json
    )
WHERE
    false;

ROLLBACK;
