import DataLoader from 'dataloader';
import { connection } from '../db/db.js';

export async function createUserLoader() {

  return new DataLoader(async (ids) => {

    console.log('[userLoader] ids:', ids);
    const users = await connection.from('user')
      .select().whereIn('id', ids);

    return ids.map((id) => users.find((user) => user.id === id));

  });

}

export async function createBookLoader() {

  return new DataLoader(async (ids) => {

    console.log('[bookLoader] ids:', ids);
    const books = await connection.from('book')
      .select().whereIn('id', ids);

    return ids.map((id) => books.find((book) => book.id === id));

  });

}
