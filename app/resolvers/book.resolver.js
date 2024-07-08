import { userHasBookDatamapper } from '../datamappers/index.datamapper.js';

export default {

  // Le parent est book, donc id est l'id du livre
  // Nous récupérons les enregistrements de la table d'associations
  async users ({ id }, _, { bookLoader }) {

    const users = await userHasBookDatamapper.findByBook(id);

    const newUsers = await Promise.all(
      users.map((user) => bookLoader.load(user.userId)),
    );

    return newUsers;

  },

};
