import 'dotenv/config';
import knex from 'knex';

export const connection = knex({
  client: 'pg',
  connection: {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'spedata',
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'obookgroove',
  },
  //* Pool par défaut sur PG { min: 2, max: 10 }
  pool: {
    min: 0,
    max: 10,
  },
});
