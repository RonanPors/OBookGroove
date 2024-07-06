import { bookDatamapper } from "../datamappers/index.datamapper.js";

export default {

  // book_id est présent car le parent est user
  // Nous récupérons les livres de l'utilisateur depuis la table d'associations
  async book({ book_id }) {

    const book = await bookDatamapper.findByPk(book_id);

    return book;

  },

};
