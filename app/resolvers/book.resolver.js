import { unauthorizedError, notFoundError } from '../errors/gql.error.js';
import { userHasBookDatamapper, commentDatamapper } from '../datamappers/index.datamapper.js';

export default {

  // Le parent est book, donc id est l'id du livre
  // Nous récupérons les enregistrements de la table d'associations
  async users ({ id }, _, { bookLoader }) {

    const users = await userHasBookDatamapper.findByBook(id);

    const newUsers = await Promise.all(
      users.map((user) => bookLoader.load(user.userId)),
    );

    return newUsers;

  },

  async comments({ id }, { limit, offset }, { user }) {

    if (!user) throw unauthorizedError('Missing authentication.');

    const comments = await commentDatamapper.findAll({
      limit,
      offset,
      where: {
        bookId: id,
      },
      order: {
        column: 'created_at',
        direction: 'desc',
      },
    });

    if (!comments)
      throw notFoundError(`No current comments found.`);

    return comments;

  },

};
