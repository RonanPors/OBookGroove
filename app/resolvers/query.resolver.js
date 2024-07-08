import { userDatamapper, bookDatamapper } from '../datamappers/index.datamapper.js';
import { notFoundError } from '../errors/gql.error.js';

export default {

  async user(_, { id }) {

    const user = await userDatamapper.findByPk(id);

    if (!user) throw notFoundError(`No User found with id ${id}.`);

    return user;

  },

  async users(_, { limit, offset }) {

    const items = await userDatamapper.findAll({ limit, offset });
    const totalCount = await userDatamapper.count();

    return { items, totalCount };

  },

  async book(_, { id }) {

    const book = await bookDatamapper.findByPk(id);

    if (!book) throw notFoundError(`No Book found with id ${id}.`);

    return book;

  },

  async books(_, { limit, offset }) {

    const items = await bookDatamapper.findAll({ limit, offset });
    const totalCount = await bookDatamapper.count();

    return { items, totalCount };

  },

};
