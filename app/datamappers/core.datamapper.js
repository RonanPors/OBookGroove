class CoreDatamapper {

  tableName;

  constructor(client) {
    this.client = client;
  }

  async findByPk(id) {

    const row = await this.client.from(this.tableName).where({ id }).first();
    return row;

  }

  async findByEmail(email) {

    const row = await this.client.from(this.tableName).where({ email }).first();
    return row;

  }

  async findByPseudo(pseudo) {

    const row = await this.client.from(this.tableName).where({ pseudo }).first();
    return row;

  }

  async findAll(params) {

    const rows = await this.client.from(this.tableName);

    if (params?.where) query.where(params.where);

    return rows;

  }

  async create(inputData) {

    const { rows: [row] } = await this.client.raw(`
      SELECT *
      FROM insert_${this.tableName}
      (?)
    `, [inputData]);

    return row;

  }

  async update(inputData) {

    const { rows: [row] } = await this.client.raw(`
      SELECT *
      FROM update_${this.tableName}
      (?)
    `, [inputData]);

    return row;

  }

  async delete(id) {

    const affectedRows = await this.client.from(this.tableName).where({ id }).del();
    return !!affectedRows;

  }

}

export default CoreDatamapper;
