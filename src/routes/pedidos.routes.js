import express from "express";
import * as pedidoController from "../controllers/pedidos.controllers.js";
import { validateBody } from "../middlewares/validate_body.js";

const router = express.Router();

//CREATE
router.post("/", validateBody, pedidoController.create);

//READ
router.get("/", pedidoController.findAll);
router.get("/:id", pedidoController.findById);

//UPDATE
router.put("/:id", validateBody, pedidoController.update);

//DELETE
router.delete("/:id", pedidoController.deleteById);

export default router;