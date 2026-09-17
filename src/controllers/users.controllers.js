import * as userService from "../services/user.service.js";
import chalk from "chalk";

const log = {
    error: (msg) => console.log(chalk.red(msg)),
};

// Todas las respuestas siguen el formato consistente { status, message, data }

export const findAll = async (req, res) => {
    try {
        // Tarea PLUS: filtrado dinámico por query params, ej: /api/users?firstname=Juan
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

// Requisito Lección 6: usuario + todos sus pedidos en una sola consulta (con include)
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

export const create = async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;

        if (!firstname || !lastname || !email) {
            return res.status(400).json({
                status: "error",
                message: "No se proporcionan todos los campos requeridos.",
                data: null,
            });
        }

        const newUser = await userService.createUser({ firstname, lastname, email });

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

// Requisito Lección 4 (Transaccionalidad): crea un usuario y su primer pedido
// en una sola operación atómica. Si falla el pedido, se revierte todo (rollback).
export const createWithPedido = async (req, res) => {
    try {
        const { firstname, lastname, email, descripcion, monto } = req.body;

        if (!firstname || !lastname || !email || !descripcion) {
            return res.status(400).json({
                status: "error",
                message:
                    "Faltan campos requeridos (firstname, lastname, email, descripcion).",
                data: null,
            });
        }

        const { user, pedido } = await userService.createUserWithPedido(
            { firstname, lastname, email },
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

        // Solo se actualizan los campos que efectivamente llegaron en el body,
        // para permitir actualizaciones parciales sin pisar datos con "undefined".
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