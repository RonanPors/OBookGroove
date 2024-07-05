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
        "refresh_token"
    )
    VALUES
    (
        'Max',
        'max@oclock.io',
        '$2b$12$bZaufSjg9KLuV9b0qqt6/.Uo97.uHF95k2TYQnZDDK8eLOfzXq.2i',
        'refresh_token'
    ),-- Antestdefou3*
    (
        'Arnaud',
        'arnaud@oclock.io',
        '$2b$12$bZaufSjg9KLuV9b0qqt6/.Uo97.uHF95k2TYQnZDDK8eLOfzXq.2i',
        'refresh_token'
    ), -- Antestdefou3*
    (
        'Ronane',
        'ronane@oclock.io',
        '$2b$12$bZaufSjg9KLuV9b0qqt6/.Uo97.uHF95k2TYQnZDDK8eLOfzXq.2i',
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
        'quelquun',
        'resumé de fou',
        '{ "genre1", "genre2", "genre3" }',
        'http://img.fr',
        '2024',
        '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      'quelquun',
      'resumé de fou',
      '{ "genre1", "genre2", "genre3" }',
      'http://img.fr',
      '2024',
      '12'
    ),
    (
      '123AbNcdFD',
      'horry potter',
      'quelquun',
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
      "user_id"
    )
    VALUES
    (
      1, 2
    ),
    (
      1, 3
    ),
    (
      1, 1
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

  pool.end();
})();
