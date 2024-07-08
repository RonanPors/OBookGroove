import { userHasBookDatamapper } from '../datamappers/index.datamapper.js';
import { isoToDate } from '../utils/isoToDate.js';

export default {

  // Le parent est user, toutes les propriétés récupérées depuis la BDD
  //! Le moteur GraphQL priorise toujour la valeur de retour d'un resolver
  //! Donc même si les rows possèdaient déjà un champ 'lastLogin', le retour de ce resolver surcharge l'objet final
  lastLogin: ({ lastLogin }) => isoToDate(lastLogin),

  // Le parent est user, donc id est l'id de l'utilisateur
  // Nous récupérons les enregistrements de la table d'associations
  async books ({ id }, _, { bookLoader }) {

    const books = await userHasBookDatamapper.findByUser(id);

    const newBooks = await Promise.all(
      books.map((book) => bookLoader.load(book.bookId)),
    );

    return newBooks;

  },

};
