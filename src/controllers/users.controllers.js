import * as userService from "../services/user.service.js";
import { uploadAvatar as uploadMiddleware } from "../middlewares/upload.middleware.js";
import chalk from "chalk";

const log = {
    error: (msg) => console.log(chalk.red(msg)),
};

// Todas las respuestas siguen el formato consistente { status, message, data }

export const findAll = async (req, res) => {
    try {
        const { firstname, email } = req.query;
        const users = await userService.getAllUsers({ firstname, email });

        res.json({
            status: "ok",
            message: "Usuarios obtenidos con éxito.",
            data: users,
        });
    } catch (error) {
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar obtener los datos de los usuarios, intente más tarde...",
            data: null,
        });
    }
};

export const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await userService.getUserById(id);

        if (!usuario) {
            return res
                .status(404)
                .json({ status: "error", message: "Usuario no encontrado.", data: null });
        }

        res.json({ status: "ok", message: "Usuario encontrado.", data: usuario });
    } catch (error) {
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar obtener el usuario, intente más tarde.",
            data: null,
        });
    }
};

export const findByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const usuario = await userService.getUserByEmail(email);

        if (!usuario) {
            return res
                .status(404)
                .json({ status: "error", message: "Usuario no encontrado.", data: null });
        }

        res.json({ status: "ok", message: "Usuario encontrado.", data: usuario });
    } catch (error) {
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar obtener el usuario, intente más tarde.",
            data: null,
        });
    }
};

export const findWithPedidos = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await userService.getUserWithPedidos(id);

        if (!usuario) {
            return res
                .status(404)
                .json({ status: "error", message: "Usuario no encontrado.", data: null });
        }

        res.json({
            status: "ok",
            message: "Usuario con sus pedidos obtenido con éxito.",
            data: usuario,
        });
    } catch (error) {
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al obtener el usuario junto a sus pedidos.",
            data: null,
        });
    }
};

// NOTA: la creación de usuarios "normal" ahora pasa por /api/auth/register
// (requiere password). Se mantiene este endpoint por compatibilidad, pero
// requiere también un password válido.
export const create = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "No se proporcionan todos los campos requeridos (incluye password).",
                data: null,
            });
        }

        const newUser = await userService.createUser({ firstname, lastname, email, password });

        res.status(201).json({
            status: "ok",
            message: "Usuario creado con éxito",
            data: newUser,
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
            message: "Error al intentar guardar el usuario, intente más tarde.",
            data: null,
        });
    }
};

export const createWithPedido = async (req, res) => {
    try {
        const { firstname, lastname, email, password, descripcion, monto } = req.body;

        if (!firstname || !lastname || !email || !password || !descripcion) {
            return res.status(400).json({
                status: "error",
                message:
                    "Faltan campos requeridos (firstname, lastname, email, password, descripcion).",
                data: null,
            });
        }

        const { user, pedido } = await userService.createUserWithPedido(
            { firstname, lastname, email, password },
            { descripcion, monto },
        );

        res.status(201).json({
            status: "ok",
            message: "Usuario y pedido creados correctamente (transacción exitosa).",
            data: { user, pedido },
        });
    } catch (error) {
        if (error.code) {
            return res
                .status(error.code)
                .json({ status: "error", message: error.message, data: null });
        }
        res.status(400).json({
            status: "error",
            message: "La transacción fue revertida: " + error.message,
            data: null,
        });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email } = req.body;

        const changes = {};
        if (firstname) changes.firstname = firstname;
        if (lastname) changes.lastname = lastname;
        if (email) changes.email = email;

        const user = await userService.updateUser(id, changes);

        res.status(201).json({
            status: "ok",
            message: "Usuario actualizado con éxito.",
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
            message: "Error al intentar actualizar el usuario.",
            data: null,
        });
    }
};

export const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);

        res.json({ status: "ok", message: "Usuario eliminado con éxito", data: null });
    } catch (error) {
        if (error.code) {
            return res
                .status(error.code)
                .json({ status: "error", message: error.message, data: null });
        }
        log.error(error.message);
        res.status(500).json({
            status: "error",
            message: "Error al intentar eliminar el usuario, intente más tarde.",
            data: null,
        });
    }
};

// Módulo 8: subida de avatar (protegida con JWT) + asociación con el usuario en la BD
export const uploadUserAvatar = (req, res) => {
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: err.message,
                data: null,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No se recibió ningún archivo. El campo debe llamarse 'avatar'.",
                data: null,
            });
        }

        try {
            const { id } = req.params;
            const avatarPath = `/uploads/${req.file.filename}`;
            const user = await userService.updateAvatar(id, avatarPath);

            res.json({
                status: "ok",
                message: "Avatar subido y asociado al usuario con éxito.",
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
                message: "Error al asociar el avatar al usuario.",
                data: null,
            });
        }
    });
};