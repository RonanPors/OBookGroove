-- Verify obookgroove:10_crud_functions_collection_share_table on pg

BEGIN;

-- XXX Add verifications here.

SELECT *
FROM insert_collection_share (
        '{"collection_id": "1", "user_id": "1"}'::json
    )
WHERE
    false;

ROLLBACK;
