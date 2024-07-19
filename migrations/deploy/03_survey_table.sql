-- Deploy obookgroove:03_survey_table to pg

BEGIN;

-- XXX Add DDLs here.

CREATE TABLE "survey" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" INT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "question_answer" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;
