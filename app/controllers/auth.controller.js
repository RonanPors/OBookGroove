import bcrypt from 'bcrypt';
import { userDatamapper } from '../datamappers/index.datamapper.js';
import { createAccessToken, createRefreshToken } from '../auth/jwt.utils.js';

export default {

  async signup(req, res) {

    try {

      const {
        pseudo,
        email,
        password,
        confirmPassword,
      } = req.body;

      // Vérifier si les deux mots de passe sont les mêmes
      if (password !== confirmPassword) throw new Error('Error signup.');

      // Vérifier que l'email est unique
      const emailExist = await userDatamapper.findByEmail(email);
      if (emailExist) throw new Error('Error signup.');

      // Vérifier que le pseudo est unique
      const pseudoExist = await userDatamapper.findByPseudo(pseudo);
      if (pseudoExist) throw new Error('Error signup.');

      // Génération du salt
      const salt = await bcrypt.genSalt(12);
      // Création d'un nouvel utilisateur
      const user = await userDatamapper.create({
        ...req.body,
        password: await bcrypt.hash(password, salt),
      });

      // Vérifier si l'utilisateur a bien été créé
      if (!user) throw new Error('Error signup.');

      // Génération des deux tokens (access & refresh)
      const response = {
        accessToken: createAccessToken(user),
        tokenType: 'Bearer',
        refreshToken: createRefreshToken(user),
      };

      // Retourner les deux tokens ici
      return res.json(response);

    } catch (err) {
      console.error(err);
      return res.json({ error: err.message });
    }

  },

};
