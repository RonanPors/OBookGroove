import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/auth/signup', authController.signup);

router.post('/auth/signin', authController.signin);

export default router;
