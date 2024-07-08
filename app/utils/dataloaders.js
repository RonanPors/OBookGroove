import DataLoader from 'dataloader';
import { connection } from '../db/db.js';

export function createUserLoader() {

  return new DataLoader(async (ids) => {

    console.log('[userLoader] ids:', ids);
    const users = await connection.table('user')
      .select().whereIn('id', ids);

    return ids.map((id) => users.find((user) => user.id === id));

  });

}

export function createBookLoader() {

  return new DataLoader(async (ids) => {

    console.log('[bookLoader] ids:', ids);
    const books = await connection.table('book')
      .select().whereIn('id', ids);

    return ids.map((id) => books.find((book) => book.id === id));

  });

}
