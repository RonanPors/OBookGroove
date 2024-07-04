import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { userDatamapper } from '../datamappers/index.datamapper.js';
import { checkAccessTokenValidity, checkRefreshTokenValidity, claimsTokenVerify, createAccessToken, createRefreshToken } from '../auth/jwt.utils.js';
import { sendEmail } from '../utils/sendEmail.js';

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
        pseudo,
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
      res.cookie('accessTokenObg', `Bearer ${response.accessToken}`, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
      });
      res.cookie('refreshTokenObg', response.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
      });

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
        pseudo: user.pseudo,
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
      res.cookie('accessTokenObg', `Bearer ${response.accessToken}`, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
      });
      res.cookie('refreshTokenObg', response.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
      });

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
        throw new Error('Error generate tokens.');

      // Vérifier et décoder le token d'accès
      const decodedAccessToken = checkAccessTokenValidity(accessTokenObg, true);

      // Si le token d'accès est non valide
      //! non valide = impossible à signer avec le secret
      if (!decodedAccessToken)
        throw new Error('Error generate tokens.');

      // Vérifier si l'objet claims des deux tokens sont les mêmes
      const claimsIsValid = claimsTokenVerify(
        decodedAccessToken.claims,
        decodedRefreshToken.claims,
      );
      if (!claimsIsValid)
        throw new Error('Error generate tokens.');

      // Vérifier l'ip de la requête avec celle stockée dans le token
      const { claims: { fingerprint: { ip } } } = decodedAccessToken;
      if (req.ip !== ip)
        throw new Error('Error generate tokens.');

      // Vérifier l'user-agent de la requête avec celui stocké dans le token
      const { claims: { fingerprint: { userAgent } } } = decodedAccessToken;
      if (req.headers['user-agent'] !== userAgent)
        throw new Error('Error generate tokens.');

      // Récupérer l'utilisateur en BDD depuis l'id du token qui est dans sub
      const user = await userDatamapper.findByPk(decodedAccessToken.claims.sub);

      // Vérifier que le refresh token est le même que celui de l'utilisateur en bdd
      // Car les refresh tokens valident mais qui ne sont pas en BDD ne seront pas pris en compte
      //! One-time Use Tokens
      console.log('refresh_token:', user.refresh_token);
      console.log('refreshTokenObg:', refreshTokenObg);
      if (user.refresh_token !== refreshTokenObg)
        throw new Error('Error generate tokens.');

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
      res.cookie('accessTokenObg', `Bearer ${response.accessToken}`, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
      });
      res.cookie('refreshTokenObg', response.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
      });

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

  async resetPassword(req, res) {

    try {

      const { email } = req.body;

      const user = await userDatamapper.findByEmail(email);

      if (!user)
        throw new Error('L\'utilisateur est introuvable.');

      // Si l'utilisateur est trouvé, chercher s'il ne possède pas déjà un token pour reset son mot de passe
      // Afin d'éviter de générer plusieurs liens de reset password pour le même utilisateur
      if (user.reset_token)
        throw new Error('L\'utilisateur possède déjà un lien.');

      const { reset_token } = await userDatamapper.update({
        id: user.id,
        reset_token: crypto.randomBytes(32).toString("hex"),
      });

      console.log('reset_token:', reset_token);

      if (!reset_token)
        throw new Error('Erreur dans la génération du token.');

      const subject = "Réinitialisation du mot de passe - O'BookGroove";
      const html = `http://localhost:4000/reset-password/${user.id}/${reset_token}`;
      sendEmail(email, subject, html);

      return res.json({ ok: true });

    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: err.message });
    }

  },

  async resetPasswordConfirm(req, res) {

    try {

      console.log('1');

      const { userId, resetToken } = req.params;
      const { password, confirmPassword } = req.body;

      console.log('2');

      // Vérifier si les deux mots de passe sont les mêmes
      if (password !== confirmPassword)
        throw new Error('Les deux mots de passe ne sont pas les mêmes.');

      // Vérifier que le token est bien lié à l'userId
      const user = await userDatamapper.findByPk(userId);

      // Si l'utilisateur n'existe pas
      if (!user)
        throw new Error('L\'utilisateur est introuvable.');

      if (user.reset_token !== resetToken)
        throw new Error('Les deux tokens ne sont pas les mêmes');

      // Génération du salt
      const salt = await bcrypt.genSalt(12);
      // Création d'un nouvel utilisateur
      await userDatamapper.update({
        id: userId,
        password: await bcrypt.hash(password, salt),
        reset_token: null,
      });

      return res.json({ ok: true });

    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: err.message });
    }

  },

  async getResetToken(req, res) {

    try {

      const { userId } = req.params;

      const user = await userDatamapper.findByPk(userId);

      if (!user)
        throw new Error('L\'utilisateur est introuvable.');

      return res.json({ userId, resetToken: user.reset_token });

    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: err.message });
    }

  },

};
