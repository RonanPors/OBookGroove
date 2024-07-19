-- Verify obookgroove:04_crud_functions_survey_table on pg

BEGIN;

-- XXX Add verifications here.

SELECT *
FROM insert_survey (
        '{"user_id": "1", "question_answer": "{"key1": "value1", "key2": "value2"}"}'::json
    )
WHERE
    false;

ROLLBACK;
