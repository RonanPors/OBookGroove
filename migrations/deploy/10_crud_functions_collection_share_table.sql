-- Deploy obookgroove:10_crud_functions_collection_share_table to pg

BEGIN;

-- XXX Add DDLs here.

-- insert collection_share
CREATE FUNCTION "insert_collection_share"(json) RETURNS "collection_share" AS $$

  INSERT INTO "collection_share" (
    "collection_id",
    "user_id"
  ) VALUES (
    ($1->>'collection_id')::INT,
    ($1->>'user_id')::INT
  ) RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- update collection_share
CREATE FUNCTION "update_collection_share"(json) RETURNS "collection_share" AS $$

  UPDATE "collection_share" SET
    "collection_id" = COALESCE(($1->>'collection_id')::INT, "collection_id"),
    "user_id" = COALESCE(($1->>'user_id')::INT, "user_id"),
    "updated_at" = now()
  WHERE "collection_id" = ($1->>'collection_id')::INT AND "user_id" = ($1->>'user_id')::INT
  RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

COMMIT;
