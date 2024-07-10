import { connection } from '../db/db.js';
import User from './user.datamapper.js';
import Book from './book.datamapper.js';
import Survey from './survey.datamapper.js';
import Comment from './comment.datamapper.js';
import Collection from './collection.datamapper.js';
import UserHasBook from './user-has-book.datamapper.js';
import CollectionHasBook from './collection-has-book.datamapper.js';

export const userDatamapper = new User(connection);
export const bookDatamapper = new Book(connection);
export const surveyDatamapper = new Survey(connection);
export const commentDatamapper = new Comment(connection);
export const collectionDatamapper = new Collection(connection);
export const userHasBookDatamapper = new UserHasBook(connection);
export const collectionHasBookDatamapper = new CollectionHasBook(connection);
