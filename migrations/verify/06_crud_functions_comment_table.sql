-- Verify obookgroove:06_crud_functions_comment_table on pg

BEGIN;

-- XXX Add verifications here.

SELECT *
FROM insert_comment (
        '{"book_id": "1", "user_id": "1", "comment_text": "commentaire"}'::json
    )
WHERE
    false;

ROLLBACK;
