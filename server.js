import "dotenv/config";
import yargs from "yargs";
import app from "./src/app.js";
import { testConnection } from "./src/config/database.js";
import { syncModels } from "./src/models/index.js";

const portMin = 3000;
const portMax = 3010;
const argv = yargs(process.argv.slice(2))
    .option("p", {
        alias: "port",
        demandOption: true,
        default: 3000,
        describe: `Puerto de servidor entre [${portMin} - ${portMax}]`,
        type: "number",
    })
    .check((argv) => {
        if (
            !Number.isInteger(argv.port) ||
            argv.port < portMin ||
            argv.port > portMax
        ) {
            throw new Error(
                `Puerto debe estar entre  [${portMin} - ${portMax}]`,
            );
        }

        return true;
    })
    .parse();

// Si existe la variable de entorno PORT (asignada por el hosting en producción),
// se prioriza sobre el argumento de línea de comandos.
const PORT = process.env.PORT || argv.port;

const startServer = async () => {
    try {
        await testConnection();
        await syncModels();

        app.listen(PORT, () => {
            console.log("Servidor escuchando en http://localhost:" + PORT);
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error.message);
        process.exit(1);
    }
};

startServer();