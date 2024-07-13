import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import spotifyController from '../controllers/spotify.controller.js';

// Importation des schemas de validation des données.
import userCreateSchema from '../schemas/Joi/user.signup.schema.js';
import userAuthSchema from '../schemas/Joi/user.signin.schema.js';
import userResetPassSchema from '../schemas/Joi/user.reset.pass.schema.js';
import userRecaptcha from '../schemas/Joi/user.recaptcha.js';
// Importation du middleware de validation des données.
import validationMiddleware from '../middlewares/validation.middleware.js';
//Importation du middleware de gestion des erreurs controllers.
import controllerHandler  from '../middlewares/controller.handler.js';
//Importation de la class de création d'erreur.
import ErrorApi from '../errors/api.error.js';
//importation du gestionnaire finale d'erreurs.
import errorHandler from '../middlewares/error.middleware.js';
import sanitizeMiddleware from '../middlewares/sanitize.mw.js';

const router = Router();

/* Pour chaque route, le validationMiddleware vérifie les informations transmises dans la requête
puis le controllerHandler (ch) à pour rôle d'encapsuler l'appel d'une methode controller
afin de pouvoir gérer les erreurs de manières optimisé */

/**
 * POST /auth/signup
 * @summary Créer un compte utilisateur en base de données.
 * @tags Serveur d'authentification
 * @param {object} request.body.required - Pseudo, email, mot de passe de l'utilisateur
 * @example request - example payload
 * {
 *   "pseudo": "Mex",
 *   "email": "mex@oclock.io",
 *   "password": "Antestdefou3*",
 *   "confirmPassword": "Antestdefou3*"
 * }
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.post('/auth/signup', sanitizeMiddleware, validationMiddleware(userCreateSchema, 'body'), controllerHandler(authController.signup));

/**
 * POST /auth/signin
 * @summary Se connecter à un compte utilisateur déjà présent en base de données.
 * @tags Serveur d'authentification
 * @param {object} request.body.required - Email et mot de passe de l'utilisateur
 * @example request - example payload
 * {
 *   "email": "max@oclock.io",
 *   "password": "Antestdefou3*"
 * }
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.post('/auth/signin', sanitizeMiddleware, validationMiddleware(userAuthSchema, 'body'), controllerHandler(authController.signin));

/**
 * POST /auth/reset-password
 * @summary Générer un token pour le lien de réinitialisation du mot de passe de l'utilisateur
 * @tags Serveur d'authentification
 * @param {object} request.body.required - Email de l'utilisateur
 * @example request - example payload
 * {
 *   "email": "max@oclock.io"
 * }
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.post('/auth/reset-password', sanitizeMiddleware, validationMiddleware(userResetPassSchema.step1, 'body'), controllerHandler(authController.resetPassword));

/**
 * POST /auth/reset-password/{userId}/{resetToken}
 * @summary Vérification et Réinitialisation du mot de passe de l'utilisateur
 * @tags Serveur d'authentification
 * @param {number} userId.path.required - ID de l'utilisateur
 * @param {string} resetToken.path.required - Reset token de l'utilisateur
 * @param {object} request.body.required - Nouveau mot de passe et confirmation de l'utilisateur
 * @example request - example payload
 * {
 *   "password": "Antestdefou3*",
 *   "confirmPassword": "Antestdefou3*"
 * }
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.post('/auth/reset-password/:userId([0-9]+)/:resetToken', sanitizeMiddleware, validationMiddleware(userResetPassSchema.step2, 'body'), controllerHandler(authController.resetPasswordConfirm));

/**
 * POST /auth/verify-recaptcha
 * @summary Vérification le token recaptcha de l'utilisateur
 * @tags Serveur d'authentification
 * @param {object} request.body.required - token recaptcha de l'utilisateur
 * @example request - example payload
 * {
 *   "token": "fezrhfbeyrufg234567"
 * }
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.post('/auth/verify-recaptcha', sanitizeMiddleware, validationMiddleware(userRecaptcha, 'body'), controllerHandler(authController.verifyRecaptcha));

/**
 * GET /auth/confirm-signup/{userId}/{confirmToken}
 * @summary Vérification et Confirmation du compte de l'utilisateur
 * @tags Serveur d'authentification
 * @param {number} userId.path.required - ID de l'utilisateur
 * @param {string} confirmToken.path.required - Token de confirmation d'inscription de l'utilisateur
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.get('/auth/confirm-signup/:userId([0-9]+)/:confirmToken', sanitizeMiddleware, controllerHandler(authController.confirmSignup));

/**
 * GET /auth/generate
 * @summary Vérifier et Générer de nouveaux tokens depuis les anciens.
 * @description Pensez à vous connecter à un compte avec la route /auth/signin pour avoir des tokens dans vos cookies
 * @tags Serveur d'authentification
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.get('/auth/generate', sanitizeMiddleware, controllerHandler(authController.generate));

/**
 * GET /auth/tokens
 * @summary Récupérer les tokens depuis les cookies.
 * @description Pensez à vous connecter à un compte avec la route /auth/signin pour avoir des tokens dans vos cookies
 * @tags Serveur d'authentification
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.get('/auth/tokens', sanitizeMiddleware, controllerHandler(authController.getTokens));

/**
 * GET /auth/logout
 * @summary Déconnecter l'utilisateur en supprimant ses tokens dans les cookies
 * @description Pensez à vous connecter à un compte avec la route /auth/signin pour avoir des tokens dans vos cookies
 * @tags Serveur d'authentification
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.get('/auth/logout', sanitizeMiddleware, controllerHandler(authController.logout));

/**
 * GET /spotify/connect-user
 * @summary Connecte un utilisateur à son compte spotify
 * @tags Serveur de mise en relation avec spotifyAPI
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.get('/spotify/connect-user', sanitizeMiddleware, controllerHandler(spotifyController.connectToSpotify));

/**
 * GET /spotify/callback
 * @summary Récupération des tokens Spotify provenant de Spotify API uniquement
 * @tags Serveur de mise en relation avec spotifyAPI
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.get('/spotify/callback', sanitizeMiddleware, controllerHandler(spotifyController.callbackSpotify));

/**
 * GET /spotify/tokens
 * @summary Rafraichire les tokens Spotify d'un utilisateurs
 * @tags Serveur de mise en relation avec spotifyAPI
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
router.get('/spotify/tokens', sanitizeMiddleware, controllerHandler(spotifyController.verifySpotifyUserToken));

router.use((_, __, next) => {
  next(new ErrorApi('NOT_FOUND', 'Resource not found', {status: 404}));
});

router.use(errorHandler);

export default router;
