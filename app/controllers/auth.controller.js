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

      // Génération des deux tokens (access & refresh)
      const response = {
        accessToken: createAccessToken(user),
        tokenType: 'Bearer',
        refreshToken: createRefreshToken(user),
      };

      // Mise à jour du refresh token de l'utilisateur
      await userDatamapper.update({
        id: user.id,
        refresh_token: response.refreshToken,
      });

      // Vérifier si l'utilisateur a bien été créé
      if (!user) throw new Error('Error signup.');

      // Retourner les deux tokens ici
      return res.json(response);

    } catch (err) {
      console.error(err);
      return res.json({ error: err.message });
    }

  },

  async signin(req, res) {

    try {

      const { email, password } = req.body;

      // Vérifier si l'email existe
      const user = await userDatamapper.findByEmail(email);
      if(!user) throw new Error('Error signin.');

      // Vérifier si le mot de passe est correct
      const isValidPassword = await bcrypt.compare(password, user.password);
      if(!isValidPassword) throw new Error('Error signin.');

      // Génération des deux tokens (access & refresh)
      const response = {
        accessToken: createAccessToken(user),
        tokenType: 'Bearer',
        refreshToken: createRefreshToken(user),
      };

      // Mettre à jour le refresh token
      // Ceci mettra aussi à jour le login
      await userDatamapper.update({
        id: user.id,
        last_login: true,
        refresh_token: response.refreshToken,
      });

      // Retourner les deux tokens ici
      return res.json(response);

    } catch (err) {
      console.error(err);
      return res.json({ error: err.message });
    }

  },

};
