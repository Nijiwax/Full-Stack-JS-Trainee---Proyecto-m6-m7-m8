import express from "express";
import * as authController from "../controllers/auth.controllers.js";
import { validateBody } from "../middlewares/validate_body.js";

const router = express.Router();

// Rutas públicas de autenticación
router.post("/register", validateBody, authController.register);
router.post("/login", validateBody, authController.login);

export default router;