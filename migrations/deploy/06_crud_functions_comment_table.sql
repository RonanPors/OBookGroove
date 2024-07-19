-- Deploy obookgroove:06_crud_functions_comment_table to pg

BEGIN;

-- XXX Add DDLs here.

-- insert comment
CREATE FUNCTION "insert_comment"(json) RETURNS "comment" AS $$

  INSERT INTO "comment" (
    "book_id",
    "user_id",
    "comment_text"
  ) VALUES (
    ($1->>'book_id')::INT,
    ($1->>'user_id')::INT,
    $1->>'comment_text'
  ) RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- update comment
CREATE FUNCTION "update_comment"(json) RETURNS "comment" AS $$

  UPDATE "comment" SET
    "book_id" = COALESCE(($1->>'book_id')::INT, "book_id"),
    "user_id" = COALESCE(($1->>'user_id')::INT, "user_id"),
    "comment_text" = COALESCE($1->>'comment_text', "comment_text"),
    "updated_at" = now()
  WHERE "book_id" = ($1->>'book_id')::INT AND "user_id" = ($1->>'user_id')::INT
  RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

COMMIT;
