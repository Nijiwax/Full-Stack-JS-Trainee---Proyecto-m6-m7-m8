import express from "express";
import * as userController from "../controllers/users.controllers.js";
import { validateBody } from "../middlewares/validate_body.js";

const router = express.Router();

//CREATE
router.post("/", validateBody, userController.create);

// Requisito Lección 4 (Transaccionalidad): crea usuario + su primer pedido en una sola transacción
router.post("/with-pedido", validateBody, userController.createWithPedido);

//READ
router.get("/", userController.findAll);

router.get("/:id", userController.findById);

router.get("/email/:email", userController.findByEmail);

// Requisito Lección 6: usuario junto a todos sus pedidos, en una sola consulta
router.get("/:id/pedidos", userController.findWithPedidos);

//UPDATE

router.put("/:id", validateBody, userController.update);

//DELETE

router.delete("/:id", userController.deleteById);

export default router;