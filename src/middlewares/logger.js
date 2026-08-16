import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import moment from "moment";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// La carpeta "logs" queda en la raíz del proyecto (mismo nivel que /src y /public)
const logsDir = path.join(__dirname, "..", "..", "logs");
const logFile = path.join(logsDir, "log.txt");

// Si la carpeta o el archivo no existen, se crean automáticamente
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "", "utf-8");
}

/**
 * Middleware global: registra cada request entrante en logs/log.txt
 * Formato de línea: [fecha hora] MÉTODO ruta
 */
export const logger = (req, res, next) => {
    const fecha = moment().format("YYYY-MM-DD");
    const hora = moment().format("HH:mm:ss");
    const linea = `[${fecha} ${hora}] ${req.method} ${req.originalUrl}\n`;

    fs.appendFile(logFile, linea, (err) => {
        if (err) {
            console.error("Error al escribir en el log:", err.message);
        }
    });

    next();
};