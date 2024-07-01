import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

// Importation des schemas de validation des données
import userCreateSchema from '../schemas/Joi/user.signup.schema.js';
import userAuthSchema from '../schemas/Joi/user.signin.schema.js';
// Importation du middleware de validation des données
import validationMiddleware from '../middlewares/validation.middleware.js';

const router = Router();

router.post('/auth/signup', validationMiddleware(userCreateSchema, 'body'), authController.signup);

router.post('/auth/signin', validationMiddleware(userAuthSchema, 'body'), authController.signin);

export default router;
