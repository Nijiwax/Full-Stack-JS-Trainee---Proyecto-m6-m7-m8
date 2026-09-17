import * as authService from "../services/auth.service.js";
import chalk from "chalk";

const log = {
    error: (msg) => console.log(chalk.red(msg)),
};

export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan campos requeridos (firstname, lastname, email, password).",
                data: null,
            });
        }

        const user = await authService.register({ firstname, lastname, email, password });

        res.status(201).json({
            status: "ok",
            message: "Usuario registrado con éxito.",
            data: user,
        });
    } catch (error) {
        if (error.code) {
            return res
                .status(error.code)
                .json({ status: "error", message: error.message, data: null });
        }
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar registrar el usuario.",
            data: null,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Se requieren email y password.",
                data: null,
            });
        }

        const { token, user } = await authService.login({ email, password });

        res.json({
            status: "ok",
            message: "Login exitoso.",
            data: { token, user },
        });
    } catch (error) {
        if (error.code) {
            return res
                .status(error.code)
                .json({ status: "error", message: error.message, data: null });
        }
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar iniciar sesión.",
            data: null,
        });
    }
};