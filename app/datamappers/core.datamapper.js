import * as changeKeys from 'change-case/keys';

class CoreDatamapper {

  tableName;

  constructor(client) {
    this.client = client;
  }

  async findByPk(id) {

    const row = await this.client.from(this.tableName).where({ id }).first();

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async findByEmail(email) {

    const row = await this.client.from(this.tableName).where({ email }).first();

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async findByPseudo(pseudo) {

    const row = await this.client.from(this.tableName).where({ pseudo }).first();

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async findAll(params) {

    const rows = await this.client.from(this.tableName);

    if (params?.where) rows.where(params.where);

    const newRows = rows.map((row) => changeKeys.camelCase(row));

    return newRows;

  }

  async create(inputData) {

    const newInputData = changeKeys.snakeCase(inputData);

    const { rows: [row] } = await this.client.raw(`
      SELECT *
      FROM insert_${this.tableName}
      (?)
    `, [newInputData]);

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async update(inputData) {

    const newInputData = changeKeys.snakeCase(inputData);

    const { rows: [row] } = await this.client.raw(`
      SELECT *
      FROM update_${this.tableName}
      (?)
    `, [newInputData]);

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async delete(id) {

    const affectedRows = await this.client.from(this.tableName).where({ id }).del();
    return !!affectedRows;

  }

}

export default CoreDatamapper;
