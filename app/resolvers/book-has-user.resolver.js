export default {

  // user_id est présent car le parent est user
  // Nous récupérons les livres de l'utilisateur depuis la table d'associations
  async user({ user_id }, _, { userLoader }) {

    //! Ancienne façon de faire avec le datamapper \/
    //* const user = await userDatamapper.findByPk(user_id);

    // Utilisation du DataLoader pour la table 'user'
    const user = await userLoader.load(user_id);

    return user;

  },

};
