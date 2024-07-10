import CoreDatamapper from './core.datamapper.js';
import * as changeKeys from 'change-case/keys';

class CollectionHasBook extends CoreDatamapper {
  tableName = 'collection_has_book';

  async findByCollection(collectionId) {

    const rows = await this.client.from(this.tableName)
      .where({ 'collection_id': collectionId });

    const newRows = rows.map((row) => changeKeys.camelCase(row));

    return newRows;

  }

  async findByBook(bookId) {

    const rows = await this.client.from(this.tableName)
      .where({ 'book_id': bookId });

    const newRows = rows.map((row) => changeKeys.camelCase(row));

    return newRows;

  }
}

export default CollectionHasBook;
