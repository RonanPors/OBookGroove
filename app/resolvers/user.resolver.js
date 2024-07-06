import { userHasBookDatamapper } from '../datamappers/index.datamapper.js';
import { isoToDate } from '../utils/isoToDate.js';

export default {

  // Le parent est user, toutes les propriétés récupérées depuis la BDD
  //! Le moteur GraphQL priorise toujour la valeur de retour d'un resolver
  //! Donc même si les rows possèdaient déjà un champ 'last_login', le retour de ce resolver surcharge l'objet final
  last_login: ({ createdAt }) => isoToDate(createdAt),

  // Le parent est user, donc id est l'id de l'utilisateur
  // Nous récupérons les enregistrements de la table d'associations
  books: async ({ id }) => await userHasBookDatamapper.findByUser(id),

};
