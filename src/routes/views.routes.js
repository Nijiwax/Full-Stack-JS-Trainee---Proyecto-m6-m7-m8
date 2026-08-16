import express from "express";
import * as viewsController from "../controllers/views.controllers.js";
import { status } from "../controllers/status.controller.js";

const router = express.Router();

//RUTAS
router.get("/", viewsController.homeView);

router.get("/status", status);

router.get("/users", viewsController.usersView);

router.get("/users/add", viewsController.usersAddView);

router.get("/users/update/:id", viewsController.usersUpdateView);

export default router;