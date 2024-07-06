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
    return row;

  }

  async findByEmail(email) {

    const row = await this.client.from(this.tableName)
      .where({ email })
      .first();
    return row;

  }

  async findByPseudo(pseudo) {

    const row = await this.client.from(this.tableName)
      .where({ pseudo })
      .first();
    return row;

  }

  async findAll(params) {

    const rows = this.client.from(this.tableName);

    if (params?.where) rows.where(params.where);

    if (params?.limit) rows.limit(params.limit);

    if (params?.offset) rows.offset(params.offset);

    return await rows;

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

    const [ row ] = await this.client.from(this.tableName)
      .where({ id })
      .del()
      .returning('*');

    return row;

  }

}

export default CoreDatamapper;
