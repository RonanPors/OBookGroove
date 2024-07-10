-- Deploy obookgroove:07_collection_tables to pg

BEGIN;

-- XXX Add DDLs here.

CREATE TABLE "collection" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "collection_name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "collection_has_book" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "collection_id" INT NOT NULL REFERENCES "collection"("id") ON DELETE CASCADE,
    "book_id" INT NOT NULL REFERENCES "book"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

ALTER TABLE "collection_has_book"
ADD CONSTRAINT collection_has_book_unique UNIQUE ("collection_id", "book_id");

-- cette contrainte sert à ce qu'un même utilisateur n'est pas deux collections du même nom
-- par contre ça ne respecte pas la casse, donc 'action' et 'Action' fonctionnent
ALTER TABLE "collection"
ADD CONSTRAINT collection_unique_name UNIQUE ("user_id", "collection_name");

COMMIT;
