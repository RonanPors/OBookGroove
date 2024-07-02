import CoreDatamapper from './core.datamapper.js';

class UserHasBook extends CoreDatamapper {
  tableName = 'user_has_book';

  async findByUser(userId) {

    const rows = await this.client.from(this.tableName).where({ 'user_id': userId });
    return rows;

  }
}

export default UserHasBook;
