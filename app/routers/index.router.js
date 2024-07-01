import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.route('/auth/signup').post(authController.signup);

export default router;
