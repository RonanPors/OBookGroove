import * as changeKeys from 'change-case/keys';

class CoreDatamapper {

  tableName;

  constructor(client) {
    this.client = client;
  }

  async count() {

    const { count } = await this.client.from(this.tableName)
      .first()
      .count('* as count');
    return count;

  }

  async findByPk(id) {

    const row = await this.client.from(this.tableName)
      .where({ id })
      .first();

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async findByEmail(email) {

    const row = await this.client.from(this.tableName)
      .where({ email })
      .first();

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async findByPseudo(pseudo) {

    const row = await this.client.from(this.tableName)
      .where({ pseudo })
      .first();

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  /* Méthode pour recuperer un livre en fonction de son titre */
  async findByTitle(title) {

    const row = await this.client.from(this.tableName)
      .where({ title })
      .first();

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  /* Méthode pour récuperer un livre en fonction de son numéro ISBN */
  async findByIsbn(isbn) {

    const row = await this.client.from(this.tableName)
      .where({ isbn })
      .first();

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async findAll(params) {

    // Transformation du where en snake_case
    const where = changeKeys.snakeCase(params.where);
    const orWhere = changeKeys.snakeCase(params.orWhere);
    const andWhere = changeKeys.snakeCase(params.andWhere);

    const query = this.client.from(this.tableName);

    if (where) query.where(where);

    if (orWhere) query.orWhere(orWhere);

    if (andWhere) query.andWhere(andWhere);

    if (params?.limit) query.limit(params.limit);

    if (params?.offset) query.offset(params.offset);

    if (params?.order) query.orderBy(
      params.order.column,
      params.order.direction,
    );

    const rows = await query;

    const newRows = rows.map((row) => changeKeys.camelCase(row));

    return await newRows;

  }

  async create(inputData) {

    const newInputData = changeKeys.snakeCase(inputData);

    console.log('newInputData:', newInputData);

    const { rows: [row] } = await this.client.raw(`
      SELECT *
      FROM insert_${this.tableName}
      (?)
    `, [JSON.stringify(newInputData)]);

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async update(inputData) {

    const newInputData = changeKeys.snakeCase(inputData);

    const { rows: [row] } = await this.client.raw(`
      SELECT *
      FROM update_${this.tableName}
      (?)
    `, [JSON.stringify(newInputData)]);

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

  async delete(params) {

    const where = changeKeys.snakeCase(params.where);
    const orWhere = changeKeys.snakeCase(params.orWhere);
    const andWhere = changeKeys.snakeCase(params.andWhere);

    const query = this.client.from(this.tableName);

    if (where) query.where(where);

    if (orWhere) query.orWhere(orWhere);

    if (andWhere) query.andWhere(andWhere);

    const rows = await query.del().returning('*');

    const newRows = changeKeys.camelCase(rows);

    return newRows;

  }

}

export default CoreDatamapper;
