import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

// Importation des schemas de validation des données.
import userCreateSchema from '../schemas/Joi/user.signup.schema.js';
import userAuthSchema from '../schemas/Joi/user.signin.schema.js';
// Importation du middleware de validation des données.
import validationMiddleware from '../middlewares/validation.middleware.js';
//Importation du middleware de gestion des erreurs controllers.
import controllerHandler  from '../middlewares/controller.handler.js';
//Importation de la class de création d'erreur.
import ErrorApi from '../errors/api.error.js';
//importation du gestionnaire finale d'erreurs.
import errorHandler from '../middlewares/error.middleware.js';

const router = Router();

/* Pour chaque route, le validationMiddleware vérifie les informations transmises dans la requête
puis le controllerHandler (ch) à pour rôle d'encapsuler l'appel d'une methode controller
afin de pouvoir gérer les erreurs de manières optimisé */
router.post('/auth/signup', validationMiddleware(userCreateSchema, 'body'), controllerHandler(authController.signup));

router.post('/auth/signin', validationMiddleware(userAuthSchema, 'body'), controllerHandler(authController.signin));

router.get('/auth/generate', controllerHandler(authController.generate));

router.get('/auth/tokens', controllerHandler(authController.getTokens));

router.use((_, res, next) => {
  next(new ErrorApi('Resource not found', {status: 404}));
});

router.use(errorHandler);

export default router;
