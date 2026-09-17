import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import moment from "moment";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logsDir = path.join(__dirname, "..", "..", "logs");
const transactionLogFile = path.join(logsDir, "transactions.log");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

if (!fs.existsSync(transactionLogFile)) {
    fs.writeFileSync(transactionLogFile, "", "utf-8");
}

/** 

@param {"success"|"rollback"} status
@param {string} detail
 */
export const logTransaction = (status, detail) => {
    const fecha = moment().format("YYYY-MM-DD HH:mm:ss");
    const linea = `[${fecha}] [${status.toUpperCase()}] ${detail}\n`;

    fs.appendFile(transactionLogFile, linea, (err) => {
        if (err) {
            console.error("Error al escribir el log de transacciones:", err.message);
        }
    });
};