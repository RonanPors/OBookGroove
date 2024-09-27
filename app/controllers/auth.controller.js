import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { userDatamapper } from '../datamappers/index.datamapper.js';
import { checkAccessTokenValidity, checkRefreshTokenValidity, claimsTokenVerify, createAccessToken, createRefreshToken } from '../auth/jwt.utils.js';
import { sendEmail } from '../utils/sendEmail.js';
import ErrorApi from '../errors/api.error.js';

export default {

  async signup(req, res) {

    const {
      pseudo,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Vérifier si les deux mots de passe sont les mêmes
    if (password !== confirmPassword)
      throw new ErrorApi('FAILED_SIGNUP', 'Les deux mots de passe ne sont pas identiques.', {status: 400});

    // Vérifier que l'email est unique
    const emailExist = await userDatamapper.findByKey('email', email);
    if (emailExist)
      throw new ErrorApi('FAILED_SIGNUP', 'L\'adresse email est dêja existante.', {status: 400});

    // Vérifier que le pseudo est unique
    const pseudoExist = await userDatamapper.findByKey('pseudo', pseudo);
    if (pseudoExist)
      throw new ErrorApi('FAILED_SIGNUP', 'Le pseudo est dêja existant.', {status: 400});

    // Génération du salt
    const salt = await bcrypt.genSalt(12);
    // Création d'un nouvel utilisateur
    const user = await userDatamapper.create({
      pseudo,
      email,
      password: await bcrypt.hash(password, salt),
    });

    // Génération du token pour créer l'url de confirmation d'inscription
    const confirmToken = crypto.randomBytes(32).toString("hex");
    if (!confirmToken)
      throw new ErrorApi('FAILED_SIGNUP', 'Erreur dans la génération du token de confirmation.', {status: 500});

    // Mise à jour du refresh token et du confirm token de l'utilisateur
    await userDatamapper.update({
      id: user.id,
      confirmToken,
    });

    // Vérifier si l'utilisateur a bien été créé
    if (!user)
      throw new ErrorApi('FAILED_SIGNUP', 'L\'utilisateur n\'a pas pu être créé.', {status: 400});

    // Envoi du mail de confirmation d'inscription
    const subject = "Confirmation d'inscription - O'BookGroove";
    const confirmationUrl = `${process.env.BASE_URL_CLIENT}/confirm-signup/${user.id}/${confirmToken}`;
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #5c6bc0;">Bienvenue sur O'BookGroove, ${pseudo} !</h1>
    <p>Merci de vous être inscrit. Pour finaliser votre inscription et activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
    <a href="${confirmationUrl}" style="background-color: #5c6bc0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmer mon inscription</a>
    <p>Ou copiez-collez ce lien dans votre navigateur :</p>
    <p><a href="${confirmationUrl}">${confirmationUrl}</a></p>
    <p>Si vous n'avez pas demandé cette inscription, veuillez ignorer cet email.</p>
    <p>Merci,</p>
    <p>L'équipe O'BookGroove</p>
  </div>
`;


    sendEmail(email, subject, html);

    // Retourner les deux tokens ici
    return res.json({ ok: true });

  },

  async signin(req, res) {

    const { email, password } = req.body;

    // Vérifier si l'email existe
    const user = await userDatamapper.findByKey('email', email);
    if (!user)
      throw new ErrorApi('FAILED_SIGNIN', 'Erreur lors de la connexion.', {status: 400});

    // Vérifier si c'est un compte qui n'a pas encore été activé
    if (!user.isActive)
      throw new ErrorApi('FAILED_SIGNIN', 'Erreur lors de la connexion.', {status: 400});

    // Vérifier si le mot de passe est correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      throw new ErrorApi('FAILED_SIGNIN', 'Erreur lors de la connexion.', {status: 400});

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
      accessToken: `Bearer ${createAccessToken(claims)}`,
      tokenType: 'Bearer',
      refreshToken: createRefreshToken(claims),
    };

    // Mettre à jour le refresh token
    // Ceci mettra aussi à jour le login parce que la valeur est true
    await userDatamapper.update({
      id: user.id,
      lastLogin: true,
      refreshToken: response.refreshToken,
    });

    // Nettoyer les cookies avant d'y stocker les tokens
    res.clearCookie('accessTokenObg');
    res.clearCookie('refreshTokenObg');

    // Renvoyer aussi les tokens dans les cookies
    // httpOnly par défaut
    res.cookie('accessTokenObg', response.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });
    res.cookie('refreshTokenObg', response.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });

    // Retourner les deux tokens ici
    return res.json(response);

  },

  async generate(req, res) {

    // Récupérer les tokens depuis les cookies de la requête
    const { accessTokenObg, refreshTokenObg } = req.cookies;

    // Vérifier et décoder le refresh token
    const decodedRefreshToken = checkRefreshTokenValidity(refreshTokenObg, false);

    // Si le refresh token est non valide ou expiré
    if (!decodedRefreshToken)
      throw new ErrorApi('FAILED_GENERATE_TOKENS', 'Token de rafraîchissement invalide ou expiré.', {status: 498});

    // Vérifier et décoder le token d'accès
    const decodedAccessToken = checkAccessTokenValidity(accessTokenObg, true);

    // Si le token d'accès est non valide
    //! non valide = impossible à signer avec le secret
    if (!decodedAccessToken)
      throw new ErrorApi('FAILED_GENERATE_TOKENS', 'Token d\'accès invalide ou expiré.', {status: 498});

    // Vérifier si l'objet claims des deux tokens sont les mêmes
    const claimsIsValid = claimsTokenVerify(
      decodedAccessToken.claims,
      decodedRefreshToken.claims,
    );
    if (!claimsIsValid)
      throw new ErrorApi('FAILED_GENERATE_TOKENS', 'Le corps des deux tokens ne sont pas identiques.', {status: 498});

    // Vérifier l'ip de la requête avec celle stockée dans le token
    const { claims: { fingerprint: { ip } } } = decodedAccessToken;
    if (req.ip !== ip)
      throw new ErrorApi('FAILED_GENERATE_TOKENS', 'On envoie Reacher ! Cache toi vite...', {status: 498});

    // Vérifier l'user-agent de la requête avec celui stocké dans le token
    const { claims: { fingerprint: { userAgent } } } = decodedAccessToken;
    if (req.headers['user-agent'] !== userAgent)
      throw new ErrorApi('FAILED_GENERATE_TOKENS', 'On envoie Reacher ! Cache toi vite...', {status: 498});

    // Récupérer l'utilisateur en BDD depuis l'id du token qui est dans sub
    const user = await userDatamapper.findByKey('id', decodedAccessToken.claims.sub);

    // Vérifier que le refresh token est le même que celui de l'utilisateur en bdd
    // Car les refresh tokens valident mais qui ne sont pas en BDD ne seront pas pris en compte
    //! One-time Use Tokens
    if (user.refreshToken !== refreshTokenObg)
      throw new ErrorApi('FAILED_GENERATE_TOKENS', 'Token de rafraîchissement non reconnu.', {status: 498});

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
      accessToken: `Bearer ${createAccessToken(claims)}`,
      tokenType: 'Bearer',
      refreshToken: createRefreshToken(claims),
    };

    // Mise à jour du refresh token de l'utilisateur en bdd
    await userDatamapper.update({
      id: user.id,
      refreshToken: response.refreshToken,
    });

    // Nettoyer les cookies avant d'y stocker les tokens
    res.clearCookie('accessTokenObg');
    res.clearCookie('refreshTokenObg');

    // Renvoyer aussi les tokens dans les cookies
    // httpOnly par défaut
    res.cookie('accessTokenObg', response.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });
    res.cookie('refreshTokenObg', response.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });

    // Renvoyer en réponse les deux tokens à jour
    return res.json(response);

  },

  getTokens(req, res) {

    // Récupérer les tokens depuis les cookies de la requête
    const { accessTokenObg, refreshTokenObg } = req.cookies;

    // Renvoyer les tokens en JSON
    return res.json({
      accessTokenObg: accessTokenObg || null,
      tokenType: 'Bearer',
      refreshTokenObg: refreshTokenObg || null,
    });

  },

  logout(req, res) {

    // Récupérer les tokens depuis les cookies de la requête
    const { accessTokenObg, refreshTokenObg } = req.cookies;

    // Nettoyer les cookies
    if (accessTokenObg) res.clearCookie('accessTokenObg');

    if (refreshTokenObg) res.clearCookie('refreshTokenObg');

    return res.json({ ok: true });

  },

  async resetPassword(req, res) {

    const { email } = req.body;

    const user = await userDatamapper.findByKey('email', email);

    if (!user)
      throw new ErrorApi('FAILED_RESET_PASSWORD', 'L\'adresse email fournie est introuvable.', {status: 400});

    const { resetToken } = await userDatamapper.update({
      id: user.id,
      resetToken: crypto.randomBytes(32).toString("hex"),
    });

    if (!resetToken)
      throw new ErrorApi('FAILED_RESET_PASSWORD', 'Erreur dans la génération du token.', {status: 500});

    const subject = "Réinitialisation du mot de passe - O'BookGroove";
    const html = `${process.env.BASE_URL_CLIENT}/reset-password/${user.id}/${resetToken}`;
    sendEmail(email, subject, html);

    return res.json({ ok: true });

  },

  async resetPasswordConfirm(req, res) {

    const { userId, resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    // Vérifier si les deux mots de passe sont les mêmes
    if (password !== confirmPassword)
      throw new ErrorApi('FAILED_RESET_PASSWORD', 'Les deux mots de passe ne sont pas identiques.', {status: 400});

    // Vérifier que le token est bien lié à l'userId
    const user = await userDatamapper.findByKey('id', userId);

    // Si l'utilisateur n'existe pas
    if (!user)
      throw new ErrorApi('FAILED_RESET_PASSWORD', 'L\'utilisateur est inexistant.', {status: 400});

    if (user.resetToken !== resetToken)
      throw new ErrorApi('FAILED_RESET_PASSWORD', 'Les tokens de réinitialisation ne sont pas identiques.', {status: 498});

    // Génération du salt
    const salt = await bcrypt.genSalt(12);
    // Création d'un nouvel utilisateur
    await userDatamapper.update({
      id: userId,
      password: await bcrypt.hash(password, salt),
      resetToken: null,
    });

    return res.json({ ok: true });

  },

  async confirmSignup(req, res) {

    const { userId, confirmToken } = req.params;

    const user = await userDatamapper.findByKey('id', userId);

    if (!user)
      throw new ErrorApi('FAILED_CONFIRM_SIGNUP', 'L\'utilisateur est inexistant.', {status: 400});

    if (user.confirmToken !== confirmToken)
      throw new ErrorApi('FAILED_CONFIRM_SIGNUP', 'Les tokens de confirmation ne sont pas identiques.', {status: 498});

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
      accessToken: `Bearer ${createAccessToken(claims)}`,
      tokenType: 'Bearer',
      refreshToken: createRefreshToken(claims),
    };

    await userDatamapper.update({
      id: userId,
      isActive: true,
      refreshToken: response.refreshToken,
      confirmToken: null,
    });

    // Nettoyer les cookies avant d'y stocker les tokens
    res.clearCookie('accessTokenObg');
    res.clearCookie('refreshTokenObg');

    // Renvoyer aussi les tokens dans les cookies
    // httpOnly par défaut
    res.cookie('accessTokenObg', response.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });
    res.cookie('refreshTokenObg', response.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    });

    return res.json(response);

  },

  async verifyRecaptcha(req, res) {

    const secretKey = process.env.SECRET_KEY_RECAPTCHA;
    const { token } = req.body;

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verificationURL, {
      method: 'POST',
    });
    const data = await response.json();

    if (!data.success)
      throw new ErrorApi('FAILED_VERIFY_RECAPTCHA', 'reCAPTCHA verification failed.', {status: 498});

    res.json({
      success: true,
      message: 'reCAPTCHA verification successful',
    });

  },

};
