-- Deploy obookgroove:09_collection_share_table to pg

BEGIN;

-- XXX Add DDLs here.

CREATE TABLE "collection_share" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "collection_id" INT NOT NULL REFERENCES "collection"("id") ON DELETE CASCADE,
    "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

-- cette contrainte sert à ce qu'un même utilisateur n'est pas deux mêmes collections partagées
ALTER TABLE "collection_share"
ADD CONSTRAINT collection_share_unique UNIQUE ("collection_id", "user_id");

COMMIT;
