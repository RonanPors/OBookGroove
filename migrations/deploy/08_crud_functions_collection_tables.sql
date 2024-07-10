-- Deploy obookgroove:08_crud_functions_collection_tables to pg

BEGIN;

-- XXX Add DDLs here.

-- insert collection
CREATE FUNCTION "insert_collection"(json) RETURNS "collection" AS $$

  INSERT INTO "collection" (
    "user_id",
    "collection_name"
  ) VALUES (
    ($1->>'user_id')::INT,
    $1->>'collection_name'
  ) RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- insert collection_has_book
CREATE FUNCTION "insert_collection_has_book"(json) RETURNS "collection_has_book" AS $$

  INSERT INTO "collection_has_book" (
    "collection_id",
    "book_id"
  ) VALUES (
    ($1->>'collection_id')::INT,
    ($1->>'book_id')::INT
  ) RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- update collection
CREATE FUNCTION "update_collection"(json) RETURNS "collection" AS $$

  UPDATE "collection" SET
    "user_id" = COALESCE(($1->>'user_id')::INT, "user_id"),
    "collection_name" = COALESCE($1->>'collection_name', "collection_name"),
    "updated_at" = now()
  WHERE "id" = ($1->>'id')::INT
  RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- update collection_has_book
CREATE FUNCTION "update_collection_has_book"(json) RETURNS "collection_has_book" AS $$

  UPDATE "collection_has_book" SET
    "collection_id" = COALESCE(($1->>'collection_id')::INT, "collection_id"),
    "book_id" = COALESCE(($1->>'book_id')::INT, "book_id"),
    "updated_at" = now()
  WHERE "collection_id" = ($1->>'collection_id')::INT AND "book_id" = ($1->>'book_id')::INT
  RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

COMMIT;
