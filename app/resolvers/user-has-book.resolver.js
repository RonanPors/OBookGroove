export default {

  // bookId est présent car le parent est user
  // Nous récupérons les livres de l'utilisateur depuis la table d'associations
  async book({ bookId }, _, { bookLoader }) {

    //! Ancienne façon de faire avec le datamapper \/
    //* const book = await bookDatamapper.findByPk(bookId);

    // Utilisation du DataLoader pour la table 'book'
    const book = await bookLoader.load(bookId);

    return book;

  },

};
