export default {

  // book_id est présent car le parent est user
  // Nous récupérons les livres de l'utilisateur depuis la table d'associations
  async book({ book_id }, _, { bookLoader }) {

    //! Ancienne façon de faire avec le datamapper \/
    //* const book = await bookDatamapper.findByPk(book_id);

    // Utilisation du DataLoader pour la table 'book'
    const book = await bookLoader.load(book_id);

    return book;

  },

};
