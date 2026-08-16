import express from "express";
import { create } from "express-handlebars";
import { logger } from "./middlewares/logger.js";
import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import userRoutes from "./routes/users.routes.js";
import viewsRoutes from "./routes/views.routes.js";

const app = express();


//***** INICIO CONFIGURACIÓN HANDLEBARS *****

const hbs = create({
	partialsDir: [
		path.join(__dirname, "views/partials/"),
	],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));



//***** FIN CONFIGURACIÓN HANDLEBARS *****


//MIDDLEWARES GLOBALES
app.use(express.json()); // -> los guarda en req.body
app.use(express.urlencoded({extended:true})); //-> los guarda en req.body

app.use(express.static('public'));
app.use(logger);

//RUTAS DE LAS VISTAS (FRONTEND)
app.use("/", viewsRoutes);
//USO DE RUTAS DE API
app.use("/api/users", userRoutes);

export default app;
