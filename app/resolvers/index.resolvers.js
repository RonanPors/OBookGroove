import GraphQLJSON from 'graphql-type-json';
import Query from './query.resolver.js';
import Mutation from './mutation.resolver.js';
import User from './user.resolver.js';
import Book from './book.resolver.js';

export default {
  JSON: GraphQLJSON,
  Query,
  Mutation,
  User,
  Book,
};
