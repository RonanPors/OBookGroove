import { connection } from '../db/db.js';
import User from './user.datamapper.js';

export const userDatamapper = new User(connection);
