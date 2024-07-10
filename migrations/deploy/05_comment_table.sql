-- Deploy obookgroove:05_comment_table to pg

BEGIN;

-- XXX Add DDLs here.

CREATE TABLE "comment" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "book_id" INT NOT NULL REFERENCES "book"("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "comment_text" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

ALTER TABLE "comment"
ADD CONSTRAINT comment_unique UNIQUE ("user_id", "book_id");

COMMIT;
