-- Deploy obookgroove:01_init to pg

BEGIN;

CREATE TABLE "user" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "pseudo" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "last_login" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "refresh_token" TEXT,
    "reset_token" TEXT,
    "confirm_token" TEXT,
    "phone_number" TEXT,
    "profile_picture" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "book" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT [],
    "resume" TEXT,
    "genre" TEXT [],
    "cover" TEXT,
    "year" INT,
    "number_of_pages" INT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user_has_book" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "book_id" INT NOT NULL REFERENCES "book"("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "note" INT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

ALTER TABLE "user_has_book"
ADD CONSTRAINT user_has_book_unique UNIQUE ("user_id", "book_id");

-- Créer un index sur le champ "isbn" de la table "book" afin d'accelerer la récupération
-- hash: Très efficace pour les égalités "="
CREATE INDEX "book_isbn_idx" ON "book" USING hash ("isbn");

COMMIT;