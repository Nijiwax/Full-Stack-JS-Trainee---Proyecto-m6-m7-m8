import express from "express";
import * as pedidoController from "../controllers/pedidos.controllers.js";
import { validateBody } from "../middlewares/validate_body.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ---------- RUTAS PÚBLICAS ----------
router.get("/", pedidoController.findAll);
router.get("/:id", pedidoController.findById);

// ---------- RUTAS PRIVADAS (requieren JWT) ----------
router.post("/", authenticateToken, validateBody, pedidoController.create);
router.put("/:id", authenticateToken, validateBody, pedidoController.update);
router.delete("/:id", authenticateToken, pedidoController.deleteById);

export default router;