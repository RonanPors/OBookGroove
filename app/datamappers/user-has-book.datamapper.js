import CoreDatamapper from './core.datamapper.js';

class UserHasBook extends CoreDatamapper {
  tableName = 'user_has_book';

  async findByUser(userId) {

    const rows = await this.client.from(this.tableName).where({ 'user_id': userId });
    return rows;

  }

  async findByBook(bookId) {

    const rows = await this.client.from(this.tableName).where({ 'book_id': bookId });
    return rows;

  }
}

export default UserHasBook;
