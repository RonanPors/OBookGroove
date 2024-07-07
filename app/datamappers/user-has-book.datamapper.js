import CoreDatamapper from './core.datamapper.js';
import * as changeKeys from 'change-case/keys';

class UserHasBook extends CoreDatamapper {
  tableName = 'user_has_book';

  async findByUser(userId) {

    const rows = await this.client.from(this.tableName).where({ 'user_id': userId });

    const newRows = rows.map((row) => changeKeys.camelCase(row));

    return newRows;

  }
}

export default UserHasBook;
