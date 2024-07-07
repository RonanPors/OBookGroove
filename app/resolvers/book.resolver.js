import { userHasBookDatamapper } from '../datamappers/index.datamapper.js';

export default {

  // Le parent est book, donc id est l'id du livre
  // Nous récupérons les enregistrements de la table d'associations
  users: async ({ id }) => await userHasBookDatamapper.findByBook(id),

};
