import 'dotenv/config';
import knex from 'knex';
import mockDb from 'mock-knex';

import Book from '../book.datamapper';

describe('Book DataMapper', () => {

  let db;
  let tracker;

  // Exécutée avant tout
  beforeAll(() => {

    db = knex({
      client: 'pg',
      connection: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        user: process.env.PG_USER || 'spedata',
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE || 'obookgroove',
      },
      pool: {
        min: 0,
        max: 10,
      },
    });

    // Mocker la base de données
    mockDb.mock(db);

    // Stocker le tracker de mock-knex
    tracker = mockDb.getTracker();

  });

  // Exécutée avant chaque test
  beforeEach(() => {

    // Installer le tracker
    tracker.install();

  });

  // Exécutée après chaque test
  afterEach(() => {

    // Supprimer le tracker
    tracker.uninstall();

  });

  // Exécutée après tout
  afterAll(() => {

    // Supprimer le mock de la base de données
    mockDb.unmock(db);

  });

  // Test pour la méthode count
  test('Compter tous les enregistrements de la table Book', async () => {

    // Créer une instance de Book utilisant le Core DataMapper
    const bookDatamapper = new Book(db);

    // Simuler la réponse de la base de données grâce au tracker
    tracker.on('query', (query) => {
      query.response([{ count: 4 }]);
    });

    // Appeler la méthode count
    const result = await bookDatamapper.count();

    // Vérifier que le résultat est correct
    expect(result).toBe(4);

  });

  // Test pour la méthode findByKey
  test('Trouver un enregistrement par clé primaire dans la table Book', async () => {

    // Créer une instance de Book utilisant le Core DataMapper
    const bookDatamapper = new Book(db);

    // Simuler la réponse de la base de données grâce au tracker
    tracker.on('query', (query) => {
      query.response({
        id: 1,
        isbn: '123AbNcdFD',
        title: 'Horry Potter',
        author: 'J.K. Rowling',
        resume: 'Un résumé du livre',
        genre: 'Fantasy',
        cover: 'http://img.fr',
        year: 2024,
        number_of_pages: 350,
      });
    });

    // Appeler la méthode findByKey
    const result = await bookDatamapper.findByKey('id', 1);

    // Vérifier que le résultat est correct
    expect(result).toEqual({
      id: 1,
      isbn: '123AbNcdFD',
      title: 'Horry Potter',
      author: 'J.K. Rowling',
      resume: 'Un résumé du livre',
      genre: 'Fantasy',
      cover: 'http://img.fr',
      year: 2024,
      numberOfPages: 350,  // CamelCase appliqué par change-case
    });

  });

  // Test pour la méthode findAll
  test('Trouver tous les enregistrements de la table Book avec des conditions', async () => {

    // Créer une instance de Book utilisant le Core DataMapper
    const bookDatamapper = new Book(db);

    // Simuler la réponse de la base de données grâce au tracker
    tracker.on('query', (query) => {
      query.response([
        {
          id: 1,
          isbn: '123AbNcdFD',
          title: 'Horry Potter',
          author: 'J.K. Rowling',
          resume: 'Un résumé du livre',
          genre: 'Fantasy',
          cover: 'http://img.fr',
          year: 2024,
          number_of_pages: 350,
        },
        {
          id: 2,
          isbn: '456EfGhiJK',
          title: 'Lord of the Rings',
          author: 'J.R.R. Tolkien',
          resume: 'Un autre résumé',
          genre: 'Fantasy',
          cover: 'http://img.com',
          year: 1954,
          number_of_pages: 423,
        },
      ]);
    });

    // Appeler la méthode findAll avec des conditions
    const result = await bookDatamapper.findAll({
      where: { genre: 'Fantasy' },
      order: { column: 'year', direction: 'desc' },
    });

    // Vérifier que le résultat est correct
    expect(result).toEqual([
      {
        id: 1,
        isbn: '123AbNcdFD',
        title: 'Horry Potter',
        author: 'J.K. Rowling',
        resume: 'Un résumé du livre',
        genre: 'Fantasy',
        cover: 'http://img.fr',
        year: 2024,
        numberOfPages: 350,  // CamelCase appliqué par change-case
      },
      {
        id: 2,
        isbn: '456EfGhiJK',
        title: 'Lord of the Rings',
        author: 'J.R.R. Tolkien',
        resume: 'Un autre résumé',
        genre: 'Fantasy',
        cover: 'http://img.com',
        year: 1954,
        numberOfPages: 423,  // CamelCase appliqué par change-case
      },
    ]);

  });

  // Test pour la méthode create
  test('Créer un nouvel enregistrement dans la table Book', async () => {

    // Créer une instance de Book utilisant le Core DataMapper
    const bookDatamapper = new Book(db);

    // Simuler la réponse de la base de données grâce au tracker
    tracker.on('query', (query) => {
      query.response({
        rows: [{
          id: 1,
          isbn: '123AbNcdFD',
          title: 'Horry Potter',
          author: 'J.K. Rowling',
          resume: 'Un résumé du livre',
          genre: 'Fantasy',
          cover: 'http://img.fr',
          year: 2024,
          number_of_pages: 350,
        }],
      });
    });


    // Appeler la méthode create
    const result = await bookDatamapper.create({
      isbn: '123AbNcdFD',
      title: 'Horry Potter',
      author: 'J.K. Rowling',
      resume: 'Un résumé du livre',
      genre: 'Fantasy',
      cover: 'http://img.fr',
      year: 2024,
      numberOfPages: 350,  // CamelCase appliqué par change-case
    });

    // Vérifier que le résultat est correct
    expect(result).toEqual({
      id: 1,
      isbn: '123AbNcdFD',
      title: 'Horry Potter',
      author: 'J.K. Rowling',
      resume: 'Un résumé du livre',
      genre: 'Fantasy',
      cover: 'http://img.fr',
      year: 2024,
      numberOfPages: 350,  // CamelCase appliqué par change-case
    });

  });

  // Test pour la méthode update
  test('Mettre à jour un enregistrement dans la table Book', async () => {

    // Créer une instance de Book utilisant le Core DataMapper
    const bookDatamapper = new Book(db);

    // Simuler la réponse de la base de données grâce au tracker
    tracker.on('query', (query) => {
      query.response({
        rows: [{
          id: 1,
          isbn: '123AbNcdFD',
          title: 'Horry Potter - Updated',
          author: 'J.K. Rowling',
          resume: 'Un résumé mis à jour',
          genre: 'Fantasy',
          cover: 'http://img.fr',
          year: 2024,
          number_of_pages: 350,
        }],
      });
    });

    // Appeler la méthode update
    const result = await bookDatamapper.update({
      id: 1,
      title: 'Horry Potter - Updated',
      resume: 'Un résumé mis à jour',
    });

    // Vérifier que le résultat est correct
    expect(result).toEqual({
      id: 1,
      isbn: '123AbNcdFD',
      title: 'Horry Potter - Updated',
      author: 'J.K. Rowling',
      resume: 'Un résumé mis à jour',
      genre: 'Fantasy',
      cover: 'http://img.fr',
      year: 2024,
      numberOfPages: 350,  // CamelCase appliqué par change-case
    });

  });

  // Test pour la méthode delete
  test('Supprimer un enregistrement dans la table Book', async () => {

    // Créer une instance de Book utilisant le Core DataMapper
    const bookDatamapper = new Book(db);

    // Simuler la réponse de la base de données grâce au tracker
    tracker.on('query', (query) => {
      query.response({
        id: 1,
        isbn: '123AbNcdFD',
        title: 'Horry Potter',
        author: 'J.K. Rowling',
        resume: 'Un résumé du livre',
        genre: 'Fantasy',
        cover: 'http://img.fr',
        year: 2024,
        number_of_pages: 350,
      });
    });

    // Appeler la méthode delete
    const result = await bookDatamapper.delete({
      where: { id: 1 },
    });

    // Vérifier que le résultat est correct
    expect(result).toEqual({
      id: 1,
      isbn: '123AbNcdFD',
      title: 'Horry Potter',
      author: 'J.K. Rowling',
      resume: 'Un résumé du livre',
      genre: 'Fantasy',
      cover: 'http://img.fr',
      year: 2024,
      numberOfPages: 350,  // CamelCase appliqué par change-case
    });

  });

});
