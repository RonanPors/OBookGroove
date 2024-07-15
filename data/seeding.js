import 'dotenv/config';

import pg from 'pg';

const pool = new pg.Pool({
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

async function insertUsers() {
  await pool.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');

  const queryStr = `
    INSERT INTO "user"
    (
        "pseudo",
        "email",
        "password",
        "is_active",
        "refresh_token"
    )
    VALUES
    (
        'Max',
        'max@oclock.io',
        '$2b$12$bZaufSjg9KLuV9b0qqt6/.Uo97.uHF95k2TYQnZDDK8eLOfzXq.2i',
        'true',
        'refresh_token'
    ),-- Antestdefou3*
    (
        'Arnaud',
        'arnaud@oclock.io',
        '$2b$12$bZaufSjg9KLuV9b0qqt6/.Uo97.uHF95k2TYQnZDDK8eLOfzXq.2i',
        'true',
        'refresh_token'
    ), -- Antestdefou3*
    (
        'Ronane',
        'ronane@oclock.io',
        '$2b$12$bZaufSjg9KLuV9b0qqt6/.Uo97.uHF95k2TYQnZDDK8eLOfzXq.2i',
        'true',
        'refresh_token'
    ) -- Antestdefou3*
    RETURNING id
  `;

  const result = await pool.query(queryStr);
  return result.rows;
}

async function insertBooks() {
  await pool.query('TRUNCATE TABLE "book" RESTART IDENTITY CASCADE');

  const queryStr = `
    INSERT INTO "book"
    (
        "isbn",
        "title",
        "author",
        "resume",
        "genre",
        "cover",
        "year",
        "number_of_pages"
    )
    VALUES
    (
        '123AbNcdFD',
        'horry potter',
        '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
        'resumé de fou',
        '{ "genre1", "genre2", "genre3" }',
        'http://img.fr',
        '2024',
        '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      '{ "quelqu''un 1", "quelqu''un 2", "quelqu''un 3" }',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    )
    RETURNING id
  `;

  const result = await pool.query(queryStr);
  return result.rows;
}

async function insertUserHasBook() {
  await pool.query('TRUNCATE TABLE "user_has_book" RESTART IDENTITY CASCADE');

  const queryStr = `
    INSERT INTO "user_has_book"
    (
      "book_id",
      "user_id",
      "is_read",
      "note"
    )
    VALUES
    (
      1, 1, true, 1
    ),
    (
      2, 1, true, 1
    ),
    (
      3, 1, true, 1
    ),
    (
      4, 1, true, 1
    ),
    (
      5, 1, false, 1
    ),
    (
      6, 1, false, 1
    ),
    (
      7, 1, false, 1
    ),
    (
      8, 1, false, 1
    ),
    (
      9, 1, false, 1
    ),
    (
      10, 1, false, 1
    )
    RETURNING id
  `;

  const result = await pool.query(queryStr);
  return result.rows;
}

async function insertSurveys() {
  await pool.query('TRUNCATE TABLE "survey" RESTART IDENTITY CASCADE');

  const queryStr = `
    INSERT INTO "survey"
    (
        "user_id",
        "question_answer"
    )
    VALUES
    (
        '1',
        '{"key1": "value1", "key2": "value2"}'
    ),
    (
        '2',
        '{"key1": "value1", "key2": "value2"}'
    ),
    (
        '3',
        '{"key1": "value1", "key2": "value2"}'
    )
    RETURNING id
  `;

  const result = await pool.query(queryStr);
  return result.rows;
}

async function insertComments() {
  await pool.query('TRUNCATE TABLE "comment" RESTART IDENTITY CASCADE');

  const queryStr = `
    INSERT INTO "comment"
    (
      "book_id",
      "user_id",
      "comment_text"
    )
    VALUES
    (
      1, 2, 'commentaire'
    ),
    (
      1, 3, 'commentaire'
    ),
    (
      1, 1, 'commentaire'
    ),
    (
      2, 3, 'commentaire'
    ),
    (
      2, 1, 'commentaire'
    ),
    (
      2, 2, 'commentaire'
    ),
    (
      3, 1, 'commentaire'
    ),
    (
      3, 2, 'commentaire'
    ),
    (
      3, 3, 'commentaire'
    )
    RETURNING id
  `;

  const result = await pool.query(queryStr);
  return result.rows;
}

async function insertCollections() {
  await pool.query('TRUNCATE TABLE "collection" RESTART IDENTITY CASCADE');

  const queryStr = `
    INSERT INTO "collection"
    (
      "user_id",
      "collection_name"
    )
    VALUES
    (
      1, 'action'
    ),
    (
      2, 'roman'
    ),
    (
      3, 'aventure'
    )
    RETURNING id
  `;

  const result = await pool.query(queryStr);
  return result.rows;
}

async function insertCollectionHasBook() {
  await pool.query('TRUNCATE TABLE "collection_has_book" RESTART IDENTITY CASCADE');

  const queryStr = `
    INSERT INTO "collection_has_book"
    (
      "collection_id",
      "book_id"
    )
    VALUES
    (
      1, 1
    ),
    (
      1, 2
    ),
    (
      1, 3
    ),
    (
      2, 3
    ),
    (
      2, 1
    ),
    (
      2, 2
    ),
    (
      3, 1
    ),
    (
      3, 2
    ),
    (
      3, 3
    )
    RETURNING id
  `;

  const result = await pool.query(queryStr);
  return result.rows;
}

async function insertCollectionShares() {
  await pool.query('TRUNCATE TABLE "collection_share" RESTART IDENTITY CASCADE');

  const queryStr = `
    INSERT INTO "collection_share"
    (
      "collection_id",
      "user_id"
    )
    VALUES
    (
      1, 1
    ),
    (
      1, 2
    ),
    (
      1, 3
    )
    RETURNING id
  `;

  const result = await pool.query(queryStr);
  return result.rows;
}

(async () => {

  /**
    * Ajout d'utilisateurs en BDD
    */
  const insertedUsers = await insertUsers();
  console.log(`${insertedUsers.length} users inserted`);

  /**
    * Ajout de livres en BDD
    */
  const insertedRoles = await insertBooks();
  console.log(`${insertedRoles.length} books inserted`);

  /**
    * Association des users et des livres en BDD
    */
  const insertedUserHasRole = await insertUserHasBook();
  console.log(`${insertedUserHasRole.length} users has books inserted`);

  /**
    * Ajout des questions/réponses en BDD
    */
  const insertedSurveys = await insertSurveys();
  console.log(`${insertedSurveys.length} surveys inserted`);

  /**
    * Ajout des commentaires sur des livres en BDD
    */
  const insertedComments = await insertComments();
  console.log(`${insertedComments.length} comments inserted`);

  /**
    * Ajout des collections associées à des utilisateurs en BDD
    */
  const insertedCollections = await insertCollections();
  console.log(`${insertedCollections.length} collections inserted`);

  /**
    * Ajout de livres associés à des collections en BDD
    */
  const insertedCollectionHasBook = await insertCollectionHasBook();
  console.log(`${insertedCollectionHasBook.length} CollectionHasBook inserted`);

  /**
    * Ajout des partages de collections en BDD
    */
  const insertedCollectionShares = await insertCollectionShares();
  console.log(`${insertedCollectionShares.length} CollectionShares inserted`);

  pool.end();
})();
