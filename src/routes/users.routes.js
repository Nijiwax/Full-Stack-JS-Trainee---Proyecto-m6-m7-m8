import express from "express";
import * as userController from "../controllers/users.controllers.js";
import { validateBody } from "../middlewares/validate_body.js";

const router = express.Router();

//CREATE
router.post("/", validateBody, userController.create);

//READ
router.get("/", userController.findAll);

router.get("/:id", userController.findById);

router.get("/email/:email", userController.findByEmail);

//UPDATE

router.put("/:id", validateBody, userController.update);

//DELETE

router.delete("/:id", userController.deleteById);

export default router;
