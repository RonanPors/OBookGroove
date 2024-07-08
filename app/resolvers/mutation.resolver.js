import { userDatamapper, userHasBookDatamapper } from '../datamappers/index.datamapper.js';
import { unauthorizedError, notFoundError } from '../errors/gql.error.js';

export default {

  async updateUser(_, { input }, { user }) {

    if (!user) throw unauthorizedError('Missing authentication.');

    const updatedUser = await userDatamapper.update(input);

    if (!updatedUser) throw notFoundError(`No User found with id ${input.id}.`);

    return updatedUser;

  },

  async deleteUser(_, { id }, { user }) {

    if (!user) throw unauthorizedError('Missing authentication.');

    const deletedUser = await userDatamapper.delete(id);

    if (!deletedUser) throw notFoundError(`No User found with id ${id}.`);

    return deletedUser;

  },

  async createUserHasBook(_, { input }, { user }) {

    if (!user) throw unauthorizedError('Missing authentication.');

    const createdUserHasBook = await userHasBookDatamapper.create(input);

    if (!createdUserHasBook) throw notFoundError(`No User Has Book found with id ${input.id}.`);

    return createdUserHasBook;

  },

  async deleteUserHasBook(_, { id }, { user }) {

    if (!user) throw unauthorizedError('Missing authentication.');

    const deletedUserHasBook = await userHasBookDatamapper.delete(id);

    if (!deletedUserHasBook) throw notFoundError(`No User Has Book found with id ${id}.`);

    return deletedUserHasBook;

  },

};
