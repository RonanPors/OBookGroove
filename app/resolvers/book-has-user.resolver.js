import { userDatamapper } from "../datamappers/index.datamapper.js";

export default {

  // user_id est présent car le parent est user
  // Nous récupérons les livres de l'utilisateur depuis la table d'associations
  async user({ user_id }) {

    const user = await userDatamapper.findByPk(user_id);

    return user;

  },

};
