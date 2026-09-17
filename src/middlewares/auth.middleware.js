import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Protege una ruta exigiendo un JWT válido en el header:
 *   Authorization: Bearer <token>
 * Verifica firma y expiración. Si es válido, deja los datos del usuario
 * en req.user para que el controlador pueda usarlos.
 */
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Acceso no autorizado: falta el token de autenticación.",
            data: null,
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            const message =
                err.name === "TokenExpiredError"
                    ? "El token expiró, iniciá sesión nuevamente."
                    : "Token inválido.";

            return res.status(403).json({
                status: "error",
                message,
                data: null,
            });
        }

        req.user = decoded; // { id, email, iat, exp }
        next();
    });
};