import bcrypt from 'bcrypt';
import { userDatamapper } from '../datamappers/index.datamapper.js';
import { checkAccessTokenValidity, checkRefreshTokenValidity, claimsTokenVerify, createAccessToken, createRefreshToken } from '../auth/jwt.utils.js';

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

      // Création de l'objet claims pour les deux tokens
      const claims = {
        sub: user.id,
        fingerprint: {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        },
      };

      // Génération des deux tokens (access & refresh)
      const response = {
        accessToken: createAccessToken(claims),
        tokenType: 'Bearer',
        refreshToken: createRefreshToken(claims),
      };

      // Mise à jour du refresh token de l'utilisateur
      await userDatamapper.update({
        id: user.id,
        refresh_token: response.refreshToken,
      });

      // Vérifier si l'utilisateur a bien été créé
      if (!user) throw new Error('Error signup.');

      // Nettoyer les cookies avant d'y stocker les tokens
      res.clearCookie('accessTokenObg');
      res.clearCookie('refreshTokenObg');

      // Renvoyer aussi les tokens dans les cookies
      // httpOnly par défaut
      res.cookie('accessTokenObg', `Bearer ${response.accessToken}`);
      res.cookie('refreshTokenObg', response.refreshToken);

      // Retourner les deux tokens ici
      return res.json(response);

    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: err.message });
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

      // Création de l'objet claims pour les deux tokens
      const claims = {
        sub: user.id,
        fingerprint: {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        },
      };

      // Génération des deux tokens (access & refresh)
      const response = {
        accessToken: createAccessToken(claims),
        tokenType: 'Bearer',
        refreshToken: createRefreshToken(claims),
      };

      // Mettre à jour le refresh token
      // Ceci mettra aussi à jour le login
      await userDatamapper.update({
        id: user.id,
        last_login: true,
        refresh_token: response.refreshToken,
      });

      // Nettoyer les cookies avant d'y stocker les tokens
      res.clearCookie('accessTokenObg');
      res.clearCookie('refreshTokenObg');

      // Renvoyer aussi les tokens dans les cookies
      // httpOnly par défaut
      res.cookie('accessTokenObg', `Bearer ${response.accessToken}`);
      res.cookie('refreshTokenObg', response.refreshToken);

      // Retourner les deux tokens ici
      return res.json(response);

    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: err.message });
    }

  },

  async generate(req, res) {

    try {

      // Récupérer les tokens depuis les cookies de la requête
      const { accessTokenObg, refreshTokenObg } = req.cookies;

      // Vérifier et décoder le refresh token
      const decodedRefreshToken = checkRefreshTokenValidity(refreshTokenObg, false);

      // Si le refresh token est non valide ou expiré
      if (!decodedRefreshToken)
        throw new Error('Error generate tokens.1');

      // Vérifier et décoder le token d'accès
      const decodedAccessToken = checkAccessTokenValidity(accessTokenObg, true);

      // Si le token d'accès est non valide
      //! non valide = impossible à signer avec le secret
      if (!decodedAccessToken)
        throw new Error('Error generate tokens.2');

      // Vérifier si l'objet claims des deux tokens sont les mêmes
      const claimsIsValid = claimsTokenVerify(
        decodedAccessToken.claims,
        decodedRefreshToken.claims,
      );
      if (!claimsIsValid)
        throw new Error('Error generate tokens.3');

      // Récupérer l'utilisateur en BDD depuis l'id du token qui est dans sub
      const user = await userDatamapper.findByPk(decodedAccessToken.claims.sub);

      // Vérifier que le refresh token est le même que celui de l'utilisateur en bdd
      // Car les refresh tokens valident mais qui ne sont pas en BDD ne seront pas pris en compte
      //! One-time Use Tokens
      if (user.refresh_token !== refreshTokenObg)
        throw new Error('Error generate tokens.4');

      // Création de l'objet claims pour les deux tokens
      const claims = {
        sub: user.id,
        fingerprint: {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        },
      };

      // Génération des deux tokens (access & refresh)
      const response = {
        accessToken: createAccessToken(claims),
        tokenType: 'Bearer',
        refreshToken: createRefreshToken(claims),
      };

      // Mise à jour du refresh token de l'utilisateur en bdd
      await userDatamapper.update({
        id: user.id,
        refresh_token: response.refreshToken,
      });

      // Nettoyer les cookies avant d'y stocker les tokens
      res.clearCookie('accessTokenObg');
      res.clearCookie('refreshTokenObg');

      // Renvoyer aussi les tokens dans les cookies
      // httpOnly par défaut
      res.cookie('accessTokenObg', `Bearer ${response.accessToken}`);
      res.cookie('refreshTokenObg', response.refreshToken);

      // Renvoyer en réponse les deux tokens à jour
      return res.json(response);

    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: err.message });
    }

  },

  getTokens(req, res) {

    // Récupérer les tokens depuis les cookies de la requête
    const { accessTokenObg, refreshTokenObg } = req.cookies;

    // Renvoyer les tokens en JSON
    res.json({
      accessTokenObg,
      tokenType: 'Bearer',
      refreshTokenObg,
    });

  },

};
