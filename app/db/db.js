import 'dotenv/config';
import knex from 'knex';

export const connection = knex({
  client: 'pg',
  connection: {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || 'spedata',
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE || 'obookgroove',
  },
  //* Pool par défaut sur PG { min: 2, max: 10 }
  pool: {
    min: 0,
    max: 10,
  },
});
