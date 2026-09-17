import express from "express";
import * as userController from "../controllers/users.controllers.js";
import { validateBody } from "../middlewares/validate_body.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ---------- RUTAS PÚBLICAS ----------

//READ (lectura pública: consultar usuarios no es una operación sensible)
router.get("/", userController.findAll);

router.get("/:id", userController.findById);

router.get("/email/:email", userController.findByEmail);

router.get("/:id/pedidos", userController.findWithPedidos);

// ---------- RUTAS PRIVADAS (requieren JWT) ----------
// Se protegen todas las operaciones que crean, modifican o eliminan datos,
// y la subida de archivos, ya que son las que pueden alterar el estado del sistema.
// El registro de usuarios "nuevos" se hace vía /api/auth/register (público, sin token).

router.post("/", authenticateToken, validateBody, userController.create);

router.post(
    "/with-pedido",
    authenticateToken,
    validateBody,
    userController.createWithPedido,
);

router.put("/:id", authenticateToken, validateBody, userController.update);

router.delete("/:id", authenticateToken, userController.deleteById);

// Módulo 8: subida de avatar (protegida)
router.post("/:id/avatar", authenticateToken, userController.uploadUserAvatar);

export default router;