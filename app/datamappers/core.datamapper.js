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

    const rows = this.client.from(this.tableName);

    if (params?.where) rows.where(params.where);

    if (params?.limit) rows.limit(params.limit);

    if (params?.offset) rows.offset(params.offset);

    const newRows = rows.map((row) => changeKeys.camelCase(row));

    return await newRows;

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

    const [ row ] = await this.client.from(this.tableName)
      .where({ id })
      .del()
      .returning('*');

    const newRow = changeKeys.camelCase(row);

    return newRow;

  }

}

export default CoreDatamapper;
