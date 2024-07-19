-- Deploy obookgroove:04_crud_functions_survey_table to pg

BEGIN;

-- XXX Add DDLs here.

-- insert survey
CREATE FUNCTION "insert_survey"(json) RETURNS "survey" AS $$

  INSERT INTO "survey" (
    "user_id",
    "question_answer"
  ) VALUES (
    ($1->>'user_id')::INT,
    $1->>'question_answer'
  ) RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- update survey
CREATE FUNCTION "update_survey"(json) RETURNS "survey" AS $$

  UPDATE "survey" SET
    "user_id" = COALESCE(($1->>'user_id')::INT, "user_id"),
    "question_answer" = COALESCE($1->>'question_answer', "question_answer"),
    "updated_at" = now()
  WHERE "id" = ($1->>'id')::INT
  RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

COMMIT;
