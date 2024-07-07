export default {

  // userId est présent car le parent est user
  // Nous récupérons les livres de l'utilisateur depuis la table d'associations
  async user({ userId }, _, { userLoader }) {

    //! Ancienne façon de faire avec le datamapper \/
    //* const user = await userDatamapper.findByPk(userId);

    // Utilisation du DataLoader pour la table 'user'
    const user = await userLoader.load(userId);

    return user;

  },

};
