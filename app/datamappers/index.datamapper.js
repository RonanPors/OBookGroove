import { connection } from '../db/db.js';
import User from './user.datamapper.js';
import Book from './book.datamapper.js';
import UserHasBook from './user-has-book.datamapper.js';

export const userDatamapper = new User(connection);
export const bookDatamapper = new Book(connection);
export const userHasBookDatamapper = new UserHasBook(connection);
