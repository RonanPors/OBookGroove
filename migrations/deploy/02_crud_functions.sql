-- SQLBook: Code
-- Deploy obookgroove:02_crud_functions to pg

BEGIN;

-- XXX Add DDLs here.

-- insert user
CREATE FUNCTION "insert_user"(json) RETURNS "user" AS $$

  INSERT INTO "user" (
    "pseudo",
    "email",
    "password",
    "is_active",
    "refresh_token",
    "reset_token",
    "confirm_token",
    "phone_number",
    "profile_picture"
  ) VALUES (
    $1->>'pseudo',
    $1->>'email',
    $1->>'password',
    COALESCE(($1->>'is_active')::BOOLEAN, FALSE),
    $1->>'refresh_token',
    $1->>'reset_token',
    $1->>'confirm_token',
    $1->>'phone_number',
    $1->>'profile_picture'
  ) RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- insert book
CREATE FUNCTION "insert_book"(json) RETURNS "book" AS $$

  INSERT INTO "book" (
    "isbn",
    "title",
    "author",
    "resume",
    "genre",
    "cover",
    "year",
    "number_of_pages"
  ) VALUES (
    $1->>'isbn',
    $1->>'title',
    string_to_array($1->>'author', ',')::TEXT[],
    COALESCE($1->>'resume', NULL),
    string_to_array($1->>'genre', ',')::TEXT[],
    COALESCE($1->>'cover', NULL),
    COALESCE(($1->>'year')::INT, NULL),
    COALESCE(($1->>'number_of_pages')::INT, NULL)
  ) RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- insert user_has_book
CREATE FUNCTION "insert_user_has_book"(json) RETURNS "user_has_book" AS $$

  INSERT INTO "user_has_book" (
    "book_id",
    "user_id",
    "is_active",
    "is_favorite",
    "is_read",
    "is_blacklisted",
    "note"
  ) VALUES (
    ($1->>'book_id')::INT,
    ($1->>'user_id')::INT,
    COALESCE(($1->>'is_active')::BOOLEAN, TRUE),
    COALESCE(($1->>'is_favorite')::BOOLEAN, FALSE),
    COALESCE(($1->>'is_read')::BOOLEAN, FALSE),
    COALESCE(($1->>'is_blacklisted')::BOOLEAN, FALSE),
    ($1->>'note')::INT
  ) RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- update user
CREATE FUNCTION "update_user"(json) RETURNS "user" AS $$

  UPDATE "user" SET
    "pseudo" = COALESCE($1->>'pseudo', "pseudo"),
    "email" = COALESCE($1->>'email', "email"),
    "password" = COALESCE($1->>'password', "password"),
    "is_active" = COALESCE(($1->>'is_active')::BOOLEAN, "is_active"),
    "last_login" = COALESCE(now(), "last_login"),
    "refresh_token" = COALESCE($1->>'refresh_token', "refresh_token"),
    "reset_token" = COALESCE($1->>'reset_token', NULL),
    "confirm_token" = COALESCE($1->>'confirm_token', NULL),
    "phone_number" = COALESCE($1->>'phone_number', "phone_number"),
    "profile_picture" = COALESCE($1->>'profile_picture', "profile_picture"),
    "updated_at" = now()
  WHERE "id" = ($1->>'id')::INT
  RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- update book
CREATE FUNCTION "update_book"(json) RETURNS "book" AS $$

  UPDATE "book" SET
    "isbn" = COALESCE($1->>'isbn', "isbn"),
    "title" = COALESCE($1->>'title', "title"),
    "author" = COALESCE(($1->>'author')::TEXT[], "author"),
    "resume" = COALESCE($1->>'resume', "resume"),
    "genre" = COALESCE(($1->>'genre')::TEXT[], "genre"),
    "cover" = COALESCE($1->>'cover', "cover"),
    "year" = COALESCE(($1->>'year')::INT, "year"),
    "number_of_pages" = COALESCE(($1->>'number_of_pages')::INT, "number_of_pages"),
    "updated_at" = now()
  WHERE "id" = ($1->>'id')::INT
  RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

-- update user_has_book
CREATE FUNCTION "update_user_has_book"(json) RETURNS "user_has_book" AS $$

  UPDATE "user_has_book" SET
    "is_active" = COALESCE(($1->>'is_active')::BOOLEAN, "is_active"),
    "is_favorite" = COALESCE(($1->>'is_favorite')::BOOLEAN, "is_favorite"),
    "is_read" = COALESCE(($1->>'is_read')::BOOLEAN, "is_read"),
    "is_blacklisted" = COALESCE(($1->>'is_blacklisted')::BOOLEAN, "is_blacklisted"),
    "note" = COALESCE(($1->>'note')::INT, "note"),
    "updated_at" = now()
  WHERE "book_id" = ($1->>'book_id')::INT AND "user_id" = ($1->>'user_id')::INT
  RETURNING *

$$ LANGUAGE sql

VOLATILE STRICT;

COMMIT;