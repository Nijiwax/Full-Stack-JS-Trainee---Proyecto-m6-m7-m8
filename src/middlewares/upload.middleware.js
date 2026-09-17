import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Tipos de archivo permitidos para el avatar
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 2;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${req.params.id}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(
            new Error(
                `Tipo de archivo no permitido. Solo se aceptan: ${ALLOWED_MIME_TYPES.join(", ")}`,
            ),
        );
    }
    cb(null, true);
};

export const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
}).single("avatar"); // el campo del form-data debe llamarse "avatar"