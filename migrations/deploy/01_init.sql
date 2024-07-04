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
    "author" TEXT,
    "resume" TEXT,
    "genre" TEXT [] NOT NULL,
    "cover" TEXT,
    "year" INT,
    "number_of_pages" INT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user_has_book" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "book_id" INT NOT NULL,
    "user_id" INT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;