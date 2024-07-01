import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/auth/signup', authController.signup);

export default router;
