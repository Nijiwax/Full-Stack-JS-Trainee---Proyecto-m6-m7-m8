import yargs from "yargs";
import app from "./src/app.js";

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

const PORT = argv.port;

app.listen(PORT, () => {
    console.log("Servidor escuchando en http://localhost:" + PORT);
});
