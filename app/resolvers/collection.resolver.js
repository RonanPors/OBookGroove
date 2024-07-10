import { unauthorizedError, notFoundError } from '../errors/gql.error.js';
import { collectionHasBookDatamapper, bookDatamapper } from '../datamappers/index.datamapper.js';

export default {

  async books({ id }, { limit, offset }, { user }) {

    if (!user) throw unauthorizedError('Missing authentication.');

    const collectionHasBooks = await collectionHasBookDatamapper.findAll({
      limit,
      offset,
      where: {
        collectionId: id,
      },
      oder: {
        column: 'created_at',
        direction: 'desc',
      },
    });

    const books = await Promise.all(
      collectionHasBooks.map(({ bookId }) => bookDatamapper.findByPk(bookId)),
    );

    if (!collectionHasBooks || !books)
      throw notFoundError(`No current books found.`);

    return books;
  },

};
